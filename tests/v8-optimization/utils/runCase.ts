import { spawn } from 'child_process';
import { resolve } from 'path';

import { rootDir } from '../constants.js';

export async function runCase(casePath: string, ...args: string[]) {
  return await new Promise((res, rej) => {
    const resolvedPath = resolve(rootDir, 'tests/cases', casePath);
    const nodeProcess = spawn(
      'pnpm',
      [
        '--silent',
        'dlx',
        'tsx',
        '--allow-natives-syntax',
        '--no-warnings',
        resolvedPath,
        ...args,
      ],
      {
        shell: true,
        timeout: 10_000,
        env: process.env,
      }
    );

    let result = '';
    let error = '';

    nodeProcess.stdout.on('data', (data: { toString(): string }) => {
      result += data.toString();
    });

    nodeProcess.stderr.on('data', (data: { toString(): string }) => {
      error += data.toString();
    });

    nodeProcess.on('close', (code) => {
      if (code === 0) {
        res(result.trim() === 'true');
      } else {
        rej(new Error(`Code execution threw an error: ${error}`));
      }
    });

    nodeProcess.on('error', (error) => {
      rej(error);
    });
  });
}
