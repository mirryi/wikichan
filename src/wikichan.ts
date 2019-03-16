import { onMouseMove } from "./hover";

window.addEventListener("mousemove", onMouseMove);

$(function () {
    $("p span").each(function () {
        var $this = $(this);
        var text = $this.text();
        $this.replaceWith(text);
    });

    $("p").each(function () {
        var $this = $(this);
        var newText = $this.text().replace(/([\s])([^\s]+)/g, "$1<span>$2</span>");
        newText = newText.replace(/^([^\s]+)/g, "<span>$1</span>");
        $this.empty().append(newText);
    });

    replace("h1")
});

function replace(tag: string) {
    $(tag).each(function () {
        var $this = $(this);
        var newText = $this.text().replace(/([\s])([^\s]+)/g, "$1<span>$2</span>");
        newText = newText.replace(/^([^\s]+)/g, "<span>$1</span>");
        $this.empty().append(newText);
    });
}
