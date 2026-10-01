import sys, re, pathlib
block = pathlib.Path(sys.argv[1]).read_text()
start = "  window.customElements.define(TAG, KBPage);\n"
for p in sys.argv[2:]:
    t = pathlib.Path(p).read_text()
    i = t.rfind(start)
    assert i > 0, p
    tail = t[i:]
    assert "class extends KBPage" in tail or "__KB_PAGES" in tail, p
    assert tail.rstrip().endswith("})();"), p
    pathlib.Path(p).write_text(t[:i] + block)
    print("patched", p)
