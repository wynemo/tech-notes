## Does a "with" statement support type hinting?

PEP 526, which has been implemented in Python 3.6, allows you to annotate variables. You can use, for example,

```python
x: str
with example() as x:
    [...]
```

or

```python
with example() as x:
    x: str
    [...]
```
