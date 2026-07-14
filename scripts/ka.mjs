#!/usr/bin/env node
// ka.mjs — KiriminAja API command-line client.
//
// Zero dependencies. Runs on Node.js 18+ (native fetch), Bun, or Deno.
// The API key stays on your machine and is never printed.
//
//   node scripts/ka.mjs <command> [options]
//   node scripts/ka.mjs help
//
// Configuration (env or .env in the working directory):
//   KIRIMINAJA_SANDBOX_KEY      sandbox API key
//   KIRIMINAJA_PRODUCTION_KEY   production API key
//   KIRIMINAJA_SANDBOX=true     use sandbox (default true)
//
// Pass --prod on any command to force the production base URL.

import { readFileSync, existsSync } from "node:fs";

const SANDBOX_BASE = "https://tdev.kiriminaja.com";
const PRODUCTION_BASE = "https://client.kiriminaja.com";

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function loadDotEnv() {
  const path = ".env";
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].replace(/^["']|["']$/g, "");
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

function resolveConfig(flags) {
  loadDotEnv();
  const prod =
    flags.prod || String(process.env.KIRIMINAJA_SANDBOX).toLowerCase() === "false";
  const key = prod
    ? process.env.KIRIMINAJA_PRODUCTION_KEY
    : process.env.KIRIMINAJA_SANDBOX_KEY || process.env.KA_API_KEY;
  if (!key) {
    fail(
      `No API key found. Set ${
        prod ? "KIRIMINAJA_PRODUCTION_KEY" : "KIRIMINAJA_SANDBOX_KEY"
      } in your environment or .env file.`,
    );
  }
  return { key, baseUrl: prod ? PRODUCTION_BASE : SANDBOX_BASE, env: prod ? "production" : "sandbox" };
}

// ---------------------------------------------------------------------------
// HTTP
// ---------------------------------------------------------------------------

async function request(cfg, path, { method = "POST", body, params } = {}) {
  const url = new URL(`${cfg.baseUrl}/${path.replace(/^\//, "")}`);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== null) url.searchParams.set(k, String(v));
    }
  }
  let res;
  try {
    res = await fetch(url.toString(), {
      method,
      headers: {
        Authorization: `Bearer ${cfg.key}`,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: method === "GET" ? undefined : JSON.stringify(body ?? {}),
    });
  } catch (e) {
    fail(`Network error calling ${path}: ${e.message}`);
  }
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    fail(`Non-JSON response (HTTP ${res.status}) from ${path}:\n${text.slice(0, 500)}`);
  }
  if (res.status === 429) {
    process.stderr.write("Rate limited (HTTP 429). Back off and retry.\n");
  }
  return { httpStatus: res.status, ...json };
}

// ---------------------------------------------------------------------------
// Argument parsing
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith("--")) {
      const name = a.slice(2);
      const next = argv[i + 1];
      if (next === undefined || next.startsWith("--")) {
        flags[name] = true;
      } else {
        flags[name] = next;
        i++;
      }
    } else {
      positional.push(a);
    }
  }
  return { positional, flags };
}

function fail(msg) {
  process.stderr.write(`Error: ${msg}\n`);
  process.exit(1);
}

function print(obj) {
  process.stdout.write(JSON.stringify(obj, null, 2) + "\n");
}

// ---------------------------------------------------------------------------
// Commands
// ---------------------------------------------------------------------------

const commands = {
  provinces: {
    help: "List provinces",
    run: (cfg) => request(cfg, "coverage-area/province"),
  },
  cities: {
    help: "List cities by province — cities <provinsi_id>",
    run: (cfg, p) => request(cfg, "coverage-area/city", { body: { provinsi_id: Number(p[0]) } }),
  },
  districts: {
    help: "List districts by city — districts <kabupaten_id>",
    run: (cfg, p) => request(cfg, "coverage-area/district", { body: { kabupaten_id: Number(p[0]) } }),
  },
  subdistricts: {
    help: "List sub-districts by district — subdistricts <kecamatan_id>",
    run: (cfg, p) =>
      request(cfg, "coverage-area/sub-district", { body: { kecamatan_id: Number(p[0]) } }),
  },
  find: {
    help: "Search districts by name — find <keyword>",
    run: (cfg, p) => request(cfg, "coverage-area/district-by-name", { body: { keyword: p.join(" ") } }),
  },
  "find-sub": {
    help: "Search sub-districts by name — find-sub <keyword>",
    run: (cfg, p) =>
      request(cfg, "coverage-area/subdistrict-by-name", { body: { keyword: p.join(" ") } }),
  },
  rate: {
    help: "Express rate quote — rate --origin <id> --dest <id> [--weight g] [--courier all] [--value n] [--cod n]",
    run: (cfg, _p, f) => {
      if (!f.origin || !f.dest) fail("rate requires --origin and --dest");
      return request(cfg, "pricing/express", {
        body: {
          origin_id: Number(f.origin),
          destination_id: Number(f.dest),
          courier: f.courier ?? "all",
          weight: Number(f.weight ?? 1000),
          item_value: Number(f.value ?? 0),
          insurance: Number(f.insurance ?? 0),
          ...(f.cod ? { COD_AMOUNT: Number(f.cod) } : {}),
        },
      });
    },
  },
  couriers: {
    help: "List available couriers",
    run: (cfg) => request(cfg, "others/courier-list"),
  },
  courier: {
    help: "Courier service detail — courier <courier_code>",
    run: (cfg, p) => request(cfg, "others/courier-detail", { body: { courier_code: p[0] } }),
  },
  order: {
    help: "Create an express order from a JSON payload — order --file payload.json",
    run: (cfg, _p, f) => {
      if (!f.file) fail("order requires --file <payload.json>");
      if (!existsSync(f.file)) fail(`payload file not found: ${f.file}`);
      const payload = JSON.parse(readFileSync(f.file, "utf8"));
      return request(cfg, "order/express", { body: payload });
    },
  },
  track: {
    help: "Track an express order — track --order <id> | --awb <awb>",
    run: (cfg, _p, f) => {
      if (!f.order && !f.awb) fail("track requires --order or --awb");
      return request(cfg, "order/tracking", {
        method: "GET",
        params: { order_id: f.order, awb: f.awb },
      });
    },
  },
  void: {
    help: "Cancel an express order — void --awb <awb> [--reason ...]",
    run: (cfg, _p, f) => {
      if (!f.awb) fail("void requires --awb");
      return request(cfg, "order/void", {
        body: { awb: f.awb, reason: f.reason || "canceled by system" },
      });
    },
  },
  credit: {
    help: "KA Credit balance",
    run: (cfg) => request(cfg, "payment/ka-credit"),
  },
  "webhook-setup": {
    help: "Register a callback URL — webhook-setup --url <https://...>",
    run: (cfg, _p, f) => {
      if (!f.url) fail("webhook-setup requires --url");
      return request(cfg, "webhook/setup", { body: { url: f.url } });
    },
  },
};

function printHelp() {
  process.stdout.write("KiriminAja API client\n\n");
  process.stdout.write("Usage: node scripts/ka.mjs <command> [options] [--prod]\n\n");
  process.stdout.write("Commands:\n");
  const width = Math.max(...Object.keys(commands).map((c) => c.length));
  for (const [name, cmd] of Object.entries(commands)) {
    process.stdout.write(`  ${name.padEnd(width)}  ${cmd.help}\n`);
  }
  process.stdout.write("\nSet KIRIMINAJA_SANDBOX_KEY (or KIRIMINAJA_PRODUCTION_KEY) in env or .env.\n");
}

// ---------------------------------------------------------------------------
// Entry
// ---------------------------------------------------------------------------

async function main() {
  const [, , cmdName, ...rest] = process.argv;
  if (!cmdName || cmdName === "help" || cmdName === "--help" || cmdName === "-h") {
    printHelp();
    return;
  }
  const cmd = commands[cmdName];
  if (!cmd) {
    process.stderr.write(`Unknown command: ${cmdName}\n\n`);
    printHelp();
    process.exit(1);
  }
  const { positional, flags } = parseArgs(rest);
  const cfg = resolveConfig(flags);
  process.stderr.write(`→ ${cfg.env}\n`);
  const result = await cmd.run(cfg, positional, flags);
  print(result);
  if (result && result.status === false) process.exitCode = 2;
}

main();
