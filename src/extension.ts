import * as vscode from "vscode";

let statusBarItem: vscode.StatusBarItem;

let startDate: Date = new Date();

export function activate({ subscriptions }: vscode.ExtensionContext) {
  const commandId: string = "statusBarTime.visibilityToggle";
  const resetCommmandId: string = "statusBarTime.reset";

  subscriptions.push(
    vscode.commands.registerCommand(commandId, () => {
      const visible: boolean = vscode.workspace
        .getConfiguration()
        .get<boolean>("statusBarTime.visibility", true);
      vscode.workspace
        .getConfiguration()
        .update("statusBarTime.visibility", !visible, true);
      updateStatusBarItem();
    })
  );

  subscriptions.push(
    vscode.commands.registerCommand(resetCommmandId, () => {
      startDate = new Date();
      updateStatusBarItem();
    })
  );

  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    -1000
  );

  statusBarItem.command = resetCommmandId;
  statusBarItem.tooltip = "Click to reset the timer";
  subscriptions.push(statusBarItem);

  updateStatusBarItem();

  const interval = setInterval(updateStatusBarItem, 1000);
  subscriptions.push({ dispose: () => clearInterval(interval) });
}

export function updateStatusBarItem() {
  let timestring: string = "";
  if (!vscode.workspace.getConfiguration().get("statusBarTime.visibility")) {
    statusBarItem.hide();
    return;
  }
  let currentTime: Date = new Date();
  let elapsedTime: number = Math.floor(
    (currentTime.getTime() - startDate.getTime()) / 1000
  );
  let hours: number = Math.floor(elapsedTime / 3600);
  let minutes: number = Math.floor((elapsedTime % 3600) / 60);
  let seconds: number = elapsedTime % 60;
  timestring += hours.toString().padStart(2, "0") + ":";
  timestring += minutes.toString().padStart(2, "0") + ":";
  timestring += seconds.toString().padStart(2, "0");
  statusBarItem.text = ` $(clock) ${timestring} `;
  statusBarItem.show();
}

export function deactivate() {}
