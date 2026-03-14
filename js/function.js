
//* change sourse for image
function changeSrc(mainSrc, newSrc) {
    let mainScrArr = mainSrc.split("/");
    mainScrArr[mainScrArr.length - 1] = newSrc;
    return mainScrArr.join("/");
}
    
function nextImage() {
    let currentSlide = document.querySelector("header .slider-item.active"),
        nextImgSlide = currentSlide.nextElementSibling ?? document.querySelector("header .slider-item:first-child");
    currentSlide.classList.remove("active");
    nextImgSlide.classList.add("active");

    let numberSlide = nextImgSlide.dataset.name;
    updateSlideInLocalStorage(numberSlide);
    changeColor(numberSlide);
    changeNavLogo(numberSlide, Nav_logo, "logo");
    correctImages.forEach((img) => {
        changeNavLogo(numberSlide, img, "correct");
    });
}

function prevImage() {
    let currentSlide = document.querySelector("header .slider-item.active"),
        prevImgSlide = currentSlide.previousElementSibling ?? document.querySelector("header .slider-item:last-child");
    currentSlide.classList.remove("active");
    prevImgSlide.classList.add("active");

    let numberSlide = prevImgSlide.dataset.name;
    updateSlideInLocalStorage(numberSlide);
    changeColor(numberSlide);
    changeNavLogo(numberSlide, Nav_logo, "logo");
    correctImages.forEach((img) => {
        changeNavLogo(numberSlide, img, "correct");
    });
}

//* change main color
function changeColor(nameColor) {
    let value = getComputedStyle(html).getPropertyValue(`--${nameColor}-color`);
    html.style.setProperty("--main-color", value);
    updateColorInLocalStorage(value);
}

function updateColorInLocalStorage(value) {
    localStorage.setItem("mainColor", value);
}

function updateSlideInLocalStorage(nameSlide) {
    localStorage.setItem("nameSlide", nameSlide);
}

function updateCounterInLocalStorage() {
    localStorage.setItem("counter", counter);
}

//* change sytle image
function changeNavLogo(numberSlide, imgEle, nameFile) {
    let sourseLogo = document.querySelector("head link.logo");
    imgEle.src = changeSrc(imgEle.src, `${numberSlide}-${nameFile}.png`);
    sourseLogo.href = changeSrc(sourseLogo.href, `${numberSlide}-logo.png`);

}

//* update active link
function updateActiveLink(link, parent) {
    let parenrEle = link.closest(`${parent}`);
    let activeLink = parenrEle.querySelector(`li.active`) ?? undefined;
    activeLink?.classList.remove("active");
    link.classList.add("active");
}

//* for open popup 
function openPopup(popupName) {
    let popup = document.querySelector(`.popup[data-popup-name="${popupName}"]`);
    popup.classList.add("active");

    setTimeout(function () {
        popup.classList.add("show");
    }, 100);

}

//* for close popup
function closePopup(popupName) {
    let popup = document.querySelector(`.popup[data-popup-name="${popupName}"]`),
        popupContent = document.querySelector(`.popup[data-popup-name="${popupName}"] .content`);


    popup.classList.remove("show");
    setTimeout(function () {
        popup.classList.remove("active");
    }, 400);
}

//* show image latest
function showproducts(images, status = false) {
    productImage = ``;
    images.forEach((product, index) => {
        productImage +=
            `
            <li
                onclick="changeSelectedImg('${product}',this);updateActiveLink(this,'.product')" 
                class=" ${(index == 0) ? 'active' : ''} ${(index != images.length - 1) ? 'mb-md-0 mb-0 me-0 me-md-0' : ''} ${(status != false) ? "col" : "mb-md-2 mb-0 me-2 me-md-0 mainButton rounded-3"}">
                <img src="images/products/${product}" class="img-fluid" alt="">
            </li>
        `
    });

    return productImage;
}

//* show available size
function showSize(sizes, isProductIntoCart) {
    let size = ``;

    sizes.forEach((productSize, index) => {
        if (isProductIntoCart == undefined) {
            size += `<li
                onclick ="updateActiveLink(this,'.size');updateValue(this,'${productSize}','size')" 
                class="mainButton  ${(index == 0) ? 'active' : ''}  ${(index != sizes.length - 1) ? 'me-2' : ''}">
                ${productSize}</li>
            `;
        } else {
            size += `<li
                onclick ="updateActiveLink(this,'.size');updateValue(this,'${productSize}','size')" 
                class="mainButton  ${(isProductIntoCart.size == productSize) ? 'active' : ''}  ${(index != sizes.length - 1) ? 'me-2' : ''}">
                ${productSize}</li>
            `;
        }

    });

    return size;
}

//* show available color 
function showColor(colors, isProductIntoCart) {
    let color = ``;

    colors.forEach((productColor, index) => {
        if (isProductIntoCart == undefined) {
            color += `<li style="background-color: ${productColor};"
                onclick ="updateActiveLink(this,'.color');updateValue(this,'${productColor}','color')" 
                class="mainButton  ${(index == 0) ? 'active' : ''}  ${(index != colors.length - 1) ? 'me-2' : ''}"></li>
            `
        } else {
            color += `<li style="background-color: ${productColor};"
                onclick ="updateActiveLink(this,'.color');updateValue(this,'${productColor}','color')" 
                class="mainButton  ${(isProductIntoCart.color == productColor) ? 'active' : ''}  ${(index != colors.length - 1) ? 'me-2' : ''}"></li>
            `
        }
    });

    return color;
}


//* dicount for product
function discountProduct(price, discount) {
    let dicoun;

    if (discount == 0) {
        dicoun = price;
    } else {
        dicoun = (price * (1 - discount));
    }

    afterdiscount =
        `
        <p class="mb-0 d-flex">
            <span class="me-1"><del class="mainColor ${(discount == 0) ? 'd-none' : ''}">${price}<sup>$</sup></del></span>
            <span>${(Number.isInteger(dicoun)) ? dicoun : dicoun.toFixed(2)}<sup>$</sup></span>
        </p>
        `

    return afterdiscount;
}

//* show indicator featured
function showproductImages(productLi) {
    productImage = ``;
    productLi.forEach((product, index) => {
        productImage +=
            `
            <li
                onclick="changeSelectedImg('${product}',this);updateActiveLink(this,'.product')" 
                class="mainButton ${(index == 0) ? 'active' : ''} ${(index != productLi.length - 1) ? 'me-2' : ''}">
            </li>
        `
    });

    return productImage;
}

//* change select image
function changeSelectedImg(image, that) {
    let product = that.closest(".product"),
        seletedImg = product.querySelector(".selectedImg");
    seletedImg.src = changeSrc(seletedImg.src, image);
}

//* get information about product
function getProduct(productId) {
    return products.find(product => product.id == productId);
}

function isProductInPopup(productId, productContent) {
    return productContent.find(item => item.id == productId);
}

//* show product information in feature 
function openProductInfo(productId) {
    let product = getProduct(productId),
        isProductIntoCart = isProductInPopup(productId, productsCart);
    productContentEle = document.querySelector(`.popup[data-popup-name="product"] .content`);
    productContentEle.innerHTML =
        `
        <div class="row product info"
            data-product-id="${product.id}"
            data-selected-color="${(isProductIntoCart != undefined) ? isProductIntoCart.color : product.colors[0]}"
            data-selected-size="${(isProductIntoCart != undefined) ? isProductIntoCart.size : product.sizes[0]}">
            <div class="col-md-6">
                <div class="item">
                    <img src="images/products/${product.images[0]}" alt="" class="img-fluid selectedImg">
                    <div class="indicators">
                        <ul class="list-unstyled row">
                            ${showproducts(product.images, true)}
                        </ul>
                    </div>
                </div>
            </div>
            <div class="col-md-6">
                <div class="item">
                    <h3 class="mb-3">${product.name}</h3>
                    ${discountProduct(product.price, product.discount)}
                    <hr>
                    <p class="description">${product.description}</p>
                    
                    <div class="mb-4 size d-flex align-items-center">
                        <h6 class="mb-0 me-2 fw-bolder">Size :</h6>
                        ${showSize(product.sizes, isProductIntoCart)}
                    </div>

                    <div class="mb-4 color d-flex align-items-center">
                        <h6 class="mb-0 me-2 fw-bolder">Color :</h6>
                        <ul class="list-unstyled d-flex mb-0">
                            ${showColor(product.colors, isProductIntoCart)}
                        </ul>
                    </div>
                    <div class ="buttons d-flex align-items-center mb-0">
                        ${prepareButton(isProductIntoCart, productId)}
                    </div>

                </div>
            </div>
        </div>
    
    `
    openPopup('product');
}

//* change value for data select color and size
function updateValue(that, newValue, name) {
    let productEle = that.closest(".product");
    productEle.setAttribute(`data-selected-${name}`, newValue);
}

//* add product into cart
function addToCart(productId, btn, status) {
    let product = getProduct(productId),
        productEle = document.querySelector(`.product.info[data-product-id='${productId}']`),
        productInfoCart = {
            id: product.id,
            size: productEle.getAttribute("data-selected-size"),
            color: productEle.getAttribute("data-selected-color"),
            statusEle: status
        };
    
    productsCart.push(productInfoCart);
    toggleCartButton(btn, "remove");
    btn.setAttribute("onclick", `removeFromCart(${productId},this)`);
    updateLocalStorage();
}

//* remove product from array of product cart 
function removeFromCart(productId, btn) {
    productsCart = productsCart.filter(product => product.id != productId);
    toggleCartButton(btn, "add");
    btn?.setAttribute("onclick", `addToCart(${productId},this)`);
    updateLocalStorage();
}

//* change status button
function toggleCartButton(btn, status) {
    if (status == "add" && btn != undefined) {
        btn.textContent = "Add To Cart";
        btn.classList.remove("remove");
    } else if (status == "remove" && btn != undefined) {
        btn.textContent = "Remove From Cart";
        btn.classList.add("remove");
    }
}

//* update local storage
function updateLocalStorage() {
    localStorage.setItem("productsCart", JSON.stringify(productsCart));
}

function updateLocalStorageFovarite() {
    localStorage.setItem("productFovarite", JSON.stringify(productFovarite));
}

//* insert button in latest
function prepareButton(isProductIntoCart, productId) {
    return (isProductIntoCart == undefined) ?
        `<button class="btn mainButton rounded-2 mb-0 me-1" onclick="addToCart(${productId},this)">Add to Cart</button>`
        :
        `<button class="btn mainButton rounded-2 mb-0 me-1 remove" onclick="removeFromCart(${productId},this)">Remove From Cart</button>`;
}

function showParagraph(bool, productId) {
    return (bool != undefined) ? `<p data-id="${productId}">double click to unsave</p>` : `<p data-id="${productId}">double click to save</p>`;
}

//* insert product in popup cart
function showDataIntoCart() {
    let alertEmpty = document.querySelector(".popup[data-popup-name='shop'] .alert"),
        bodyShop = document.querySelector(".popup[data-popup-name='shop'] .content .body");
    checkProductLength(productsCart, alertEmpty, bodyShop);
    popupContentShop.innerHTML = "";
    productsCart.forEach(product => {
        let productObj = getProduct(product.id);
        popupContentShop.innerHTML +=
            `
            <div class="col-sm-6 col-md-4 mb-3 box" data-product-id ="${productObj.id}">
                <div class="item py-3 px-4 rounded-3">
                    <div class="head">
                        <img src="images/products/${productObj.images[0]}" alt="" class="img-fluid">
                    </div>
                    <div class="body">
                        <h5 class="mb-3">${(productObj.name.length > 13) ? `<abbr title="${productObj.name}">${productObj.name.slice(0, 13) + "..."}</abbr>` : productObj.name}</h5>
                        <div class="mb-3 price d-flex align-items-center">
                            <h6 class="mb-0 me-2 fw-bolder">Price :</h6>
                            ${discountProduct(productObj.price, productObj.discount)}
                        </div>
                        
                        <div class="mb-3 size d-flex align-items-center">
                            <h6 class="mb-0 me-2 fw-bolder">Size :</h6>
                            ${showSize([product.size])}
                        </div>

                        <div class="mb-3 color d-flex align-items-center">
                            <h6 class="mb-0 me-2 fw-bolder">Color :</h6>
                            <ul class="list-unstyled d-flex mb-0">
                                ${showColor([product.color])}
                            </ul>
                        </div>

                        <button class="btn w-100 btn-danger" onclick="deletProductFromCart(${productObj.id})">Remove</button>
                    </div>
                </div>
            </div>
        `
    });
}

//* check if product cart empty
function checkProductLength(products, alertEmpty, bodyShop) {
    if (products.length == 0) {
        alertEmpty.classList.remove("d-none");
        bodyShop.classList.add("d-none");
    } else {
        alertEmpty.classList.add("d-none");
        bodyShop.classList.remove("d-none");
    }
}

//* remove product from cart
function deletProductFromCart(productId) {
    let productEle = popupContentShop.querySelector(`.box[data-product-id ="${productId}"]`),
        productItemEle = document.querySelector(`.product[data-product-id ="${productId}"][data-status="true"]`) ?? undefined,
        buttonCart = productItemEle?.querySelector("button.remove"),
        alertEmpty = document.querySelector(".popup[data-popup-name='shop'] .alert"),
        bodyShop = document.querySelector(".popup[data-popup-name='shop'] .content .body");
    productEle.remove();
    removeFromCart(productId, buttonCart);
    checkProductLength(productsCart, alertEmpty, bodyShop);
}

//* show number of favorate product
function ShowHeartCounter(heart) {
    let bool = heart.classList.contains("double");
    if (bool) {
        heart.classList.remove("double");
        counter = --counter;
    } else {
        heart.classList.add("double");
        counter = ++counter;
    }
    updateCounterInLocalStorage();
    ShowCounter();
}

function ShowCounter() {
    if (counter > 0) {
        counterHeartEle.textContent = counter;
        heartHeader.classList.add("active");
        counterHeartEle.classList.remove("d-none");
    } else {
        counterHeartEle.classList.add("d-none");
        heartHeader.classList.remove("active");
    }
}

function isProductInFavorite(id) {
    return productFovarite.find((item) => item == id);
}

function addToFavorite(productId, productEle) {
    let bool = isProductInFavorite(productId),
        imageHeart = productEle.querySelector(".image img") ?? undefined;

    if (bool == undefined) {
        let paragraph = document.querySelector(`.product>p[data-id="${productId}"]`) ?? undefined;
        if (paragraph != undefined) {
            paragraph.textContent = "double click to unsave"
        }

        productFovarite.push(productId);
        updateLocalStorageFovarite();
        imageHeart?.classList.add("animate");
    } else {
        removeFromFavorite(productId);
        imageHeart?.classList.remove("animate");
    }
    setTimeout(() => {
        ShowHeartCounter(productEle);
    }, 200);
}

function removeFromFavorite(productId) {
    let paragraph = document.querySelector(`.product>p[data-id="${productId}"]`) ?? undefined;
    if (paragraph != undefined) {
        paragraph.textContent = "double click to save"
    }
    productFovarite = productFovarite.filter(product => product != productId);
    updateLocalStorageFovarite();
}

function showProductFavorite() {
    let alertEmpty = document.querySelector(".popup[data-popup-name='favorite'] .alert"),
        bodyFavorite = document.querySelector(".popup[data-popup-name='favorite'] .content .body");
    checkProductLength(productFovarite, alertEmpty, bodyFavorite);
    popupContentFavorite.innerHTML = "";
    productFovarite.forEach(productId => {
        let product = getProduct(productId);
        popupContentFavorite.innerHTML +=
            `
            <div class="col-sm-6 col-md-4 mb-3 box" data-product-id ="${product.id}">
                <div class="item py-3 px-4 rounded-3">
                    <div class="head">
                        <img src="images/products/${product.images[0]}" alt="" class="img-fluid">
                    </div>
                    <div class="body">
                        <h5 class="mb-3">${(product.name.length > 13) ? `<abbr title="${product.name}">${product.name.slice(0, 13) + "..."}</abbr>` : product.name}</h5>
                        <div class="mb-3 price d-flex align-items-center">
                            <h6 class="mb-0 me-2 fw-bolder">Price :</h6>
                            ${discountProduct(product.price, product.discount)}
                        </div>
                        
                        <div class="mb-3 size d-flex align-items-center">
                            <h6 class="mb-0 me-2 fw-bolder">Size :</h6>
                            ${showSize(product.sizes)}
                        </div>

                        <div class="mb-3 color d-flex align-items-center">
                            <h6 class="mb-0 me-2 fw-bolder">Color :</h6>
                            <ul class="list-unstyled d-flex mb-0">
                                ${showColor(product.colors)}
                            </ul>
                        </div>

                        <button class="btn w-100 btn-danger" onclick="deletProductFromFavorite(${product.id})">Remove</button>
                    </div>
                </div>
            </div>
        `
    })

}

function deletProductFromFavorite(productId) {
    let productElePopup = popupContentFavorite.querySelector(`.box[data-product-id ="${productId}"]`),
        productEle = document.querySelector(`.product[data-product-id ="${productId}"][data-status="true"]`),
        heart = document.querySelector(`.product[data-product-id ="${productId}"][data-status="true"] .fa-heart`) ?? undefined,
        alertEmpty = document.querySelector(".popup[data-popup-name='favorite'] .alert"),
        bodyFavorite = document.querySelector(".popup[data-popup-name='favorite'] .content .body"),
        imageHeart = productEle.querySelector(".image img") ?? undefined;

    if (heart != undefined) {
        ShowHeartCounter(heart);
    } else {
        imageHeart?.classList.remove("animate");
        ShowHeartCounter(productEle);
    }
    removeFromFavorite(productId);
    checkProductLength(productFovarite, alertEmpty, bodyFavorite);
    productElePopup.remove();
}