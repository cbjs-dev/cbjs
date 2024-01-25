import { spawn } from 'child_process';
import { resolve } from 'path';

export async function runCase(casePath: string, ...args: string[]) {
  return await new Promise((res, rej) => {
    const resolvedPath = resolve('tests/cases', casePath);
    const nodeProcess = spawn(
      'node',
      ['--allow-natives-syntax', '--no-warnings', '--loader tsx', resolvedPath, ...args],
      {
        shell: true,
        timeout: 10_000,
      }
    );

    let result = '';

    nodeProcess.stdout.on('data', (data) => {
      result += data.toString();
    });

    nodeProcess.on('close', (code) => {
      if (code === 0) {
        res(result.trim() === 'true');
      } else {
        rej(new Error(`Code execution threw an error: ${code}`));
      }
    });

    nodeProcess.on('error', (error) => {
      rej(error);
    });
  });
}
