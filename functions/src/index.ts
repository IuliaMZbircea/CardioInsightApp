import * as functions from "firebase-functions";

import {execFile, ChildProcess} from "child_process";
import * as path from "path";
import {Request, Response} from "express";

exports.predictRisk = functions.https.onRequest(
  (request: Request, response: Response) => {
    const userData = request.body;

    const scriptPath = path.join(__dirname, "predict.py");
    const child: ChildProcess = execFile("python3", [scriptPath],
      (error, stdout) => {
        if (error) {
          console.error("Error executing script:", error);
          response.status(500).send(error);
          return;
        }

        try {
          const result = JSON.parse(stdout);
          response.json(result);
        } catch (parseError) {
          console.error("Error parsing script output:", parseError);
          response.status(500).send(parseError);
        }
      });

    if (child.stdin) {
      child.stdin.write(JSON.stringify(userData));
      child.stdin.end();
    } else {
      response.status(500).send("Failed to write to stdin of child process");
    }
  });
