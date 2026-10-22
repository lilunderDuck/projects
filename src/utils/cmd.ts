import child_process from "node:child_process"

export class ShellExec<T extends any> {
  public constructor(protected command: (string | number)[]) {}
  
  protected outputFormat: (input: string) => any = input => input
  public getAsInt() {
    this.outputFormat = parseInt
    return this
  }

  public getAsFloat() {
    this.outputFormat = parseFloat
    return this
  }

  // @ts-ignore
  protected defaultValue: T
  public orElseDefault(defaultValue: T) {
    this.defaultValue = defaultValue
    return this
  }

  public async executeDangerously(): Promise<T> {
    const command = this.command.join(' ')
    if (command.includes('rm -rf /')) {
      throw new Error("fatal: your command contains 'rm -rf /'!!!")
    }

    const process = child_process.exec(command)
    if (!process.stdout || !process.stderr) {
      throw new Error("fatal: child process died - shell process could not be successfully spawned.")
    }

    const commandPromise = new Promise<string>((resolve, reject) => {
      const stdoutData: string[] = []
      const stderrData: string[] = []
      process.stdout?.on('data', (data) => stdoutData.push(`${data}`))
      process.stdout?.on('close', () => resolve(stdoutData.join('')))

      process.stderr?.on('data', (data) => stderrData.push(`${data}`))
      process.stderr?.on('close', () => reject(stderrData.join('')))
    })

    if (this.defaultValue !== undefined) {
      try {
        return this.outputFormat(await commandPromise)
      } catch(error) {
        console.warn("There's an error while executing the command, falling back to default value")
        console.warn("Command error:", error)
        return this.defaultValue
      }
    }

    return this.outputFormat(await commandPromise)
  }
}