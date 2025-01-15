# apple spotlight无法正常搜索

不知道怎么搞的 spotlight 不提供 “search in finder”选项了

苹果给的方法完全不行

<https://support.apple.com/en-us/102321>

还是reddit 上一个帖子 拯救了 <https://www.reddit.com/r/MacOS/comments/1125776/for_everyone_having_spotlight_search_issues_this/>

```bash
sudo mdutil -a -ioff
sudo rm -rf /.Spotlight*
sudo mdutil -a -ion
sudo mdutil -E
```


