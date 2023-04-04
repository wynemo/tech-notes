the method to get the id and name of the process which is listening on some port for macos

On macOS, you can use the lsof command to get the process ID (PID) and name of the process that is listening on a specific port. Here's the command you can run in the terminal:

Copy code
```
sudo lsof -i :<PORT_NUMBER>
```
Replace <PORT_NUMBER> with the actual port number you want to check. For example, to find the process that is listening on port 8080, you can use the following command:

Copy code
```
sudo lsof -i :8080
```
This will display a list of processes that are using the specified port. Look for the process with the status LISTEN. The second column of the output will be the PID and the first column will be the name of the process.

Note that you need to run this command with superuser privileges (i.e., using sudo) to get the full list of open ports and processes.