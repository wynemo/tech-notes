You can use Touch ID to authenticate sudo in Terminal on macOS. Here are the steps to follow:

1. Open Terminal app if you haven’t done so already, then enter the following command: `sudo nano /etc/pam.d/sudo`
2. Hit Return and then add the following line to the top: `auth sufficient pam_tid.so`
3. Save the edit with Control+O and then exit nano with Control+X[^1^][1].

I hope this helps. Let me know if you have any other questions.