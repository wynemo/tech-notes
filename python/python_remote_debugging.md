
# python remote debugging


using ```pdb``` in the your source file

        import pdb, socket
        s = socket.socket()
        s.connect(('127.0.0.1', 8888))
        f = s.makefile()
        pdb.Pdb(stdin=f, stdout=f).set_trace()
        



other package like ```rpdb```, ```rpdb2``` are doing something almost the same.


the other way is using pycharm IDE


* 
File - Settings - Project Interpreters - Add Remote

* 
Run - Add Run Configuration - python and write these: script, script parameters, python interpreter, working directory(remote), path mappings.