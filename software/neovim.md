安装neovim
```
brew install neovim
```

删除老的nvim
```
rm -rf ~/.local/share/nvim
rm -rf ~/.config/nvim/
```

安装macism

MacOS Input Source Manager

```
brew tap laishulu/homebrew
brew install macism
macism
```

把 nvim 目录 放到 ~/.config/nvim
一共装了两个插件
im-select.nvim 它负责切换输入法，在macos上使用macism
+ lazy.nvim
+ keaising/im-select.nvim
