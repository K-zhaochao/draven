document.addEventListener("DOMContentLoaded", function () {
  $("#resourceModal").on("show.bs.modal", function (event) {
    var button = $(event.relatedTarget); // Button that triggered the modal
    var title = button.data("title");
    var desc = button.data("desc");
    var link = button.data("link");
    var iconClass = button.data("icon-class");
    var iconColor = button.data("icon-color") || "var(--color-cyan-gray)";

    var modal = $(this);
    modal.find(".modal-title").text(title);
    modal.find(".modal-body #modal-desc").text(desc);
    modal.find(".modal-footer #modal-link-btn").attr("href", link);

    // Update Icon
    var iconContainer = modal.find(".modal-body .resource-icon-large");
    iconContainer.empty();
    var iconHtml =
      '<i class="' +
      iconClass +
      '" style="font-size: 64px; color: ' +
      iconColor +
      ';"></i>';
    iconContainer.append(iconHtml);
  });
});
