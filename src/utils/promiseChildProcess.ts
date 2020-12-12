import { promisify } from 'util';
import childProcess from 'child_process';

export const exec = promisify(childProcess.exec);
export const fork = promisify(childProcess.fork);
export const spawn = promisify(childProcess.spawn);