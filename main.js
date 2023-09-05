changeTab("home")

function changeTab(id) {
    fetch("./cours/" + id + ".md")
    .then(res => res.text())
    .then(data => document.getElementById("content").innerHTML = new RMark().render(data))
}