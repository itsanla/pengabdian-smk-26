import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const LOG_PATH = path.join(process.cwd(), 'log.json');

export async function POST(req: NextRequest) {
  const body = await req.json();
  const entry = { timestamp: new Date().toISOString(), ...body };

  let logs: unknown[] = [];
  if (fs.existsSync(LOG_PATH)) {
    try { logs = JSON.parse(fs.readFileSync(LOG_PATH, 'utf-8')); } catch { logs = []; }
  }
  logs.push(entry);
  fs.writeFileSync(LOG_PATH, JSON.stringify(logs, null, 2));

  return NextResponse.json({ ok: true });
}
