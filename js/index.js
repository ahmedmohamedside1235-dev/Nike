let nextSlider = document.querySelector("header .sliders>button.next"),
    prevSlider = document.querySelector("header .sliders>button.prev"),
    slides = document.querySelectorAll("header .slider-item"),
    html = document.querySelector("html"),
    navEle = document.querySelector(".navbar"),
    correctImages = document.querySelectorAll("section .title img"),
    NavLinks = document.querySelectorAll(".navbar-nav a.nav-link"),
    latestContent = document.querySelector("#Latest .content"),
    featuresContent = document.querySelector("#Featured .content .row"),
    popupContent = document.querySelectorAll(".popup .content"),
    bodyShop = document.querySelector(".popup[data-popup-name='shop'] .content .body"),
    popupContentShop = document.querySelector(".popup[data-popup-name='shop'] .content .body.item>.row"),
    alertEmpty = document.querySelector(".alert"),
    sections = document.querySelectorAll("section,header"),
    heartHeader = document.querySelector("nav i.fa-heart"),
    counterHeartEle = heartHeader.previousElementSibling,
    counter = 0,
    productsCart = [];    

if (localStorage.getItem("productsCart") == null) {
    updateLocalStorage();
} else {
    productsCart = JSON.parse(localStorage.getItem("productsCart"));
}

//* Add active to slider after loading
window.addEventListener("DOMContentLoaded", function (e) {
    slides[0].classList.add("active");
    loadingPage.classList.add("hide");
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
nextSlider.addEventListener("click", (e) => {
    let currentSlide = document.querySelector("header .slider-item.active"),
        nextImgSlide = currentSlide.nextElementSibling ?? document.querySelector("header .slider-item:first-child");
    currentSlide.classList.remove("active");
    nextImgSlide.classList.add("active");

    let numberSlide = nextImgSlide.dataset.name;
    changeColor(numberSlide);
    changeNavLogo(numberSlide, Nav_logo, "logo");
    correctImages.forEach((img) => {
        changeNavLogo(numberSlide, img, "correct");
    });
});

//* previous slide
prevSlider.addEventListener("click", (e) => {
    let currentSlide = document.querySelector("header .slider-item.active"),
        prevImgSlide = currentSlide.previousElementSibling ?? document.querySelector("header .slider-item:last-child");
    currentSlide.classList.remove("active");
    prevImgSlide.classList.add("active");

    let numberSlide = prevImgSlide.dataset.name;
    changeColor(numberSlide);
    changeNavLogo(numberSlide, Nav_logo, "logo");
    correctImages.forEach((img) => {
        changeNavLogo(numberSlide, img, "correct");
    });
});

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

    let isProductIntoCart = productsCart.find(item => item.id == product.id);
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
                            <i class="fas fa-heart" onclick="ShowHeartCounter(this)"></i>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    `;

});

features.forEach((product, index) => {
    featuresContent.innerHTML +=
        `
            <div class="col-sm-6 col-lg-3 mb-3 position-relative" data-product-id="${product.id}" data-status="false">
                <div class="item product">
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

window.addEventListener("scroll", function () {
    let scroll = this.window.scrollY;
    sections.forEach(section => {
        if (scroll >= (section.offsetTop - (navEle.clientHeight + 48))) {
            let link = this.document.querySelector(`.navbar-nav li[data-id ="${section.id}"]`);
            updateActiveLink(link, ".navbar-nav");
        }
    });
});





