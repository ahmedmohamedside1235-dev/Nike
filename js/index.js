let nextSlider = document.querySelector("header .sliders>button.next"),
    prevSlider = document.querySelector("header .sliders>button.prev"),
    slides = document.querySelectorAll("header .slider-item"),
    mainColor,
    nameSlide,
    html = document.querySelector("html"),
    navEle = document.querySelector(".navbar"),
    correctImages = document.querySelectorAll("section .title img"),
    NavLinks = document.querySelectorAll(".navbar-nav a.nav-link"),
    latestContent = document.querySelector("#Latest .content"),
    featuresContent = document.querySelector("#Featured .content .row"),
    popupContent = document.querySelectorAll(".popup .content"),
    popupContentShop = document.querySelector(".popup[data-popup-name='shop'] .content .body.item>.row"),
    popupContentFavorite = document.querySelector(".popup[data-popup-name='favorite'] .content .body.item>.row"),
    sections = document.querySelectorAll("section,header"),
    heartHeader = document.querySelector("nav i.fa-heart"),
    counterHeartEle = heartHeader.previousElementSibling,
    counter = 0,
    productsCart = [],
    productFovarite = [];

// *check if product cart in local storage
if (localStorage.getItem("productsCart") == null) {
    updateLocalStorage();
} else {
    productsCart = JSON.parse(localStorage.getItem("productsCart"));
}

//* check if main color and number of slide in local storage
if (localStorage.getItem("mainColor") == null || localStorage.getItem("nameSlide") == null ) {
    localStorage.setItem("mainColor", "#fb2527");
    localStorage.setItem("nameSlide", "first");
    localStorage.setItem("counter", 0);
    nameSlide = localStorage.getItem("nameSlide");
    mainColor = localStorage.getItem("mainColor");
} else {
    mainColor = localStorage.getItem("mainColor");
    nameSlide = localStorage.getItem("nameSlide");
    counter = JSON.parse(localStorage.getItem("counter"));
}

// *check if product favorite in local storage
if (localStorage.getItem("productFovarite") == null) {
    updateLocalStorageFovarite();
} else {
    productFovarite = JSON.parse(localStorage.getItem("productFovarite"));
}



html.style.setProperty("--main-color", mainColor);

//* Add active to slider after loading
window.addEventListener("DOMContentLoaded", function (e) {
    let slide = this.document.querySelector(`.sliders-inner .slider-item[data-name="${nameSlide}"]`);
    slide.classList.add("active");
    changeNavLogo(nameSlide, Nav_logo, "logo");
    correctImages.forEach((img) => {
        changeNavLogo(nameSlide, img, "correct");
    });
    loadingPage.classList.add("hide");
    ShowCounter();
});

//* Add class scrolled to nav bar
document.addEventListener("scroll", function (e) {
    if (window.scrollY > 10) {
        navEle.classList.add("scrolled");
    } else {
        navEle.classList.remove("scrolled");
    }
});

//* next slide
nextSlider.addEventListener("click", nextImage);

//* previous slide
prevSlider.addEventListener("click", prevImage);

setInterval(() => {
    nextImage();
}, 8000);

document.addEventListener("keydown", function (e) {
    if (e.key == "ArrowRight") {
        nextImage();
    } else if (e.key == "ArrowLeft") {
        prevImage();
    }
})


//* scroll nav links
NavLinks.forEach(link => {
    link.addEventListener("click", function (e) {
        e.preventDefault();

        let sectionId = link.getAttribute("href"),
            section = document.querySelector(`${sectionId}`);

        window.scrollTo(0, (section.offsetTop - navEle.clientHeight));
        updateActiveLink(link.closest("li"), ".navbar-nav");
    });
});

//* stop propagation for content in popup 
popupContent.forEach(function (popupCon) {
    popupCon.addEventListener("click", function (e) {
        e.stopPropagation();
    });
});

latest.forEach(function (product) {

    let isProductIntoCart = isProductInPopup(product.id, productsCart);
    let bool = isProductInFavorite(product.id);
    latestContent.innerHTML += `
        <div class="product py-3 px-4 mb-3"
        data-status="true"
        data-product-id = "${product.id}"
            data-selected-color="${(isProductIntoCart != undefined) ? isProductIntoCart.color : product.colors[0]}"
            data-selected-size="${(isProductIntoCart != undefined) ? isProductIntoCart.size : product.sizes[0]}">
            <div class="row">
                <div class="col-lg-6 part1">
                    <div class="item">
                        <div class="row">
                            <div class="col-md-2 col-lg-3 col-xl-2">
                                <div class="item">
                                    <ul class="list-unstyled mb-0 d-flex d-md-block">
                                        ${showproducts(product.images)}
                                    </ul>
                                </div>
                            </div>

                            <div class="col-md-10 col-lg-9 col-xl-10 d-flex align-items-center justify-content-center">
                                <div class="item selected">
                                    <img src="images/products/${product.images[0]}" class="img-fluid selectedImg" alt="">
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 part2">
                    <div class="item">
                        <h3 class="mainColor">${product.name}</h3>
                        <p>
                            ${product.description}
                        </p>
                        <div class="price d-flex align-items-center">
                            <h6 class="mb-0 me-2 fw-bolder">Price :</h6>
                            ${discountProduct(product.price, product.discount)}
                        </div>

                        <div class="size d-flex align-items-center">
                            <h6 class="mb-0 me-2 fw-bolder">Size :</h6>
                            ${showSize(product.sizes, isProductIntoCart)}
                        </div>

                        <div class ="buttons d-flex mb-0 align-items-center">
                            ${prepareButton(isProductIntoCart, product.id)}
                            <i class="fas fa-heart ${(bool != undefined) ? 'double' : ''}" onclick="addToFavorite(${product.id},this)"></i>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `;

});

features.forEach((product, index) => {
    let bool = isProductInFavorite(product.id);
    featuresContent.innerHTML +=
        `
            <div class="col-sm-6 col-lg-3 mb-3 position-relative" data-status="false">
                <div class="item product ${(bool != undefined) ? 'double' : ''}" ondblclick="addToFavorite(${product.id},this)" data-product-id="${product.id}" data-status="true">
                    ${showParagraph(bool,product.id)}
                    <div class="image ${(bool != undefined) ? 'animate' : ''} position-absolute  d-flex justify-content-center align-items-center">
                        <img src="images/heart.png" class="img-fluid" alt="">
                    </div>
                    <div class="head position-relative  mb-5">
                        <p class="${(product.discount == 0) ? 'd-none' : ''}">-${product.discount * 100}%</p>
                        <img src="images/products/${product.images[0]}" class="img-fluid selectedImg mb-3" alt="">
                        <i class="fas fa-search key" onclick="openProductInfo(${product.id})"></i>
                        <div class="indicators">
                            <ul class="list-unstyled d-flex justify-content-center mb-0">
                                ${showproductImages(product.images)}
                            </ul>
                        </div>
                    </div>
                    <div class="body text-center">
                        <h6>Basketball Shoes</h6>
                        ${discountProduct(product.price, product.discount)}
                    </div>
                </div>
            </div>
        `;
});

const navHeight = navEle.clientHeight + 48;
window.addEventListener("scroll", function () {
    let scroll = this.window.scrollY;
    sections.forEach(section => {
        if (scroll >= (section.offsetTop - navHeight)) {
            let link = this.document.querySelector(`.navbar-nav li[data-id ="${section.id}"]`);
            updateActiveLink(link, ".navbar-nav");
        }
    });
});

