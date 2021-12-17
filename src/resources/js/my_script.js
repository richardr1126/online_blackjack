function loadShop() {
  document.getElementById("featuredTab").className = "nav-link active";
  document.getElementById("featuredTab").style.color = "black";

  document.getElementById("profilePicturePage").style.visibility = "hidden";
  document.getElementById("profilePicturePage").style.height = 0;
  document.getElementById("profileTab").className = "nav-link";
  document.getElementById("profileTab").style.color = "white";

  document.getElementById("gameBackgroundPage").style.visibility = "hidden";
  document.getElementById("gameBackgroundPage").style.height = 0;
  document.getElementById("gameBackgroundTab").className = "nav-link";
  document.getElementById("gameBackgroundTab").style.color = "white";

  document.getElementById("cardBackgroundPage").style.visibility = "hidden";
  document.getElementById("cardBackgroundPage").style.height = 0;
  document.getElementById("cardBackgroundTab").className = "nav-link";
  document.getElementById("cardBackgroundTab").style.color = "white";
}

function switchShopPages(id) {
  if (id == "featured_Page") {
    document.getElementById("featuredPage").style.visibility = "visible";
    document.getElementById("featuredPage").style.height = "auto";
    document.getElementById("featuredTab").className = "nav-link active";
    document.getElementById("featuredTab").style.color = "black";

    document.getElementById("profilePicturePage").style.visibility = "hidden";
    document.getElementById("profilePicturePage").style.height = 0;
    document.getElementById("profileTab").className = "nav-link";
    document.getElementById("profileTab").style.color = "white";

    document.getElementById("gameBackgroundPage").style.visibility = "hidden";
    document.getElementById("gameBackgroundPage").style.height = 0;
    document.getElementById("gameBackgroundTab").className = "nav-link";
    document.getElementById("gameBackgroundTab").style.color = "white";

    document.getElementById("cardBackgroundPage").style.visibility = "hidden";
    document.getElementById("cardBackgroundPage").style.height = 0;
    document.getElementById("cardBackgroundTab").className = "nav-link";
    document.getElementById("cardBackgroundTab").style.color = "white";
  }
  if (id =="profile_Pictures") {
    document.getElementById("profilePicturePage").style.visibility = "visible";
    document.getElementById("profilePicturePage").style.height = "auto";
    document.getElementById("profileTab").className = "nav-link active";
    document.getElementById("profileTab").style.color = "black";

    document.getElementById("featuredPage").style.visibility = "hidden";
    document.getElementById("featuredPage").style.height = 0;
    document.getElementById("featuredTab").className = "nav-link";
    document.getElementById("featuredTab").style.color = "white";

    document.getElementById("gameBackgroundPage").style.visibility = "hidden";
    document.getElementById("gameBackgroundPage").style.height = 0;
    document.getElementById("gameBackgroundTab").className = "nav-link";
    document.getElementById("gameBackgroundTab").style.color = "white";

    document.getElementById("cardBackgroundPage").style.visibility = "hidden";
    document.getElementById("cardBackgroundPage").style.height = 0;
    document.getElementById("cardBackgroundTab").className = "nav-link";
    document.getElementById("cardBackgroundTab").style.color = "white";
  }
  if (id == "game_Background") {
    document.getElementById("gameBackgroundPage").style.visibility = "visible";
    document.getElementById("gameBackgroundPage").style.height = "auto";
    document.getElementById("gameBackgroundTab").className = "nav-link active";
    document.getElementById("gameBackgroundTab").style.color = "black";
    

    document.getElementById("featuredPage").style.visibility = "hidden";
    document.getElementById("featuredPage").style.height = 0;
    document.getElementById("featuredTab").className = "nav-link";
    document.getElementById("featuredTab").style.color = "white";

    document.getElementById("profilePicturePage").style.visibility = "hidden";
    document.getElementById("profilePicturePage").style.height = 0;
    document.getElementById("profileTab").className = "nav-link";
    document.getElementById("profileTab").style.color = "white";

    document.getElementById("cardBackgroundPage").style.visibility = "hidden";
    document.getElementById("cardBackgroundPage").style.height = 0;
    document.getElementById("cardBackgroundTab").className = "nav-link";
    document.getElementById("cardBackgroundTab").style.color = "white";
  }
  if (id == "card_Background") {
    document.getElementById("cardBackgroundPage").style.visibility = "visible";
    document.getElementById("cardBackgroundPage").style.height = "auto";
    document.getElementById("cardBackgroundTab").className = "nav-link active";
    document.getElementById("cardBackgroundTab").style.color = "black";

    document.getElementById("featuredPage").style.visibility = "hidden";
    document.getElementById("featuredPage").style.height = 0;
    document.getElementById("featuredTab").className = "nav-link";
    document.getElementById("featuredTab").style.color = "white";

    document.getElementById("profilePicturePage").style.visibility = "hidden";
    document.getElementById("profilePicturePage").style.height = 0;
    document.getElementById("profileTab").className = "nav-link";
    document.getElementById("profileTab").style.color = "white";

    document.getElementById("gameBackgroundPage").style.visibility = "hidden";
    document.getElementById("gameBackgroundPage").style.height = 0;
    document.getElementById("gameBackgroundTab").className = "nav-link";
    document.getElementById("gameBackgroundTab").style.color = "white";
  }
}