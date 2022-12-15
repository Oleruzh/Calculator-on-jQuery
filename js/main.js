"use strict";
// 1. Выбор цвета авто
// 2. Собираем единое текстовое описание всех выбранных опций
// 3. Расчет стоимости
// 4. Пересчет в доллары

$(document).ready(function () {
  let totalPrice = 0;
  let usdRate = 0;
  const currencyUrl = "https://www.cbr-xml-daily.ru/daily_json.js";

  // При старте страницы
  colorSelect();
  compileSpecsText();
  totalPrice = calculatePrice();

  $.ajax({
    url: currencyUrl,
    chache: false,
    success: function (data) {
      usdRate = JSON.parse(data).Valute.USD.Value;
      calculateUSD(totalPrice, usdRate);
    },
  });

  // После переключении радио кнопок
  $("#autoForm input").on("change", function () {
    compileSpecsText();
    totalPrice = calculatePrice();
    calculateUSD(totalPrice, usdRate);
  });

  function colorSelect() {
    const colorBtns = $("#colorsSelector .colorItem");
    const mainImg = $("#imgHolder img");

    colorBtns.on("click", function () {
      const imgPath = $(this).attr("data-img-path");
      mainImg.attr("src", imgPath);
    });
  }

  function calculateUSD(totalPrice, usdRate) {
    // Div для указания цены в долларах
    const modelPriceUSDHolder = $("#modelPriceUSD");

    // Рассчитываем цену в USD
    const totalPriceUSD = (totalPrice / usdRate).toFixed(0);

    // Создаем форматтер для форматирования цены
    const formatter = new Intl.NumberFormat("ru");

    // Выводим цену на страницу, орформатировав её при этом
    modelPriceUSDHolder.text(`$ ${formatter.format(totalPriceUSD)}`);
  }

  function calculatePrice() {
    // Div для указания цены
    const modelPriceHolder = $("#modelPrice");
    // Получам значения стоимости
    let enginePrice = parseInt($("input[name=engine]:checked").val());
    let transmissionPrice = parseInt(
      $("input[name=transmission]:checked").val()
    );
    let packagePrice = parseInt($("input[name=package]:checked").val());

    // Рассчитываем цену модели
    const totalPrice = enginePrice + transmissionPrice + packagePrice;
    // Создаем форматтер для цены, форматируем её в удобочитаемы вид
    const formatter = new Intl.NumberFormat("ru");
    // Размещаем полученную цену на страницу
    modelPriceHolder.text(`${formatter.format(totalPrice)} руб.`);

    return totalPrice;
  }

  function compileSpecsText() {
    // Div для указания выбранных параметров
    const modelSpecsHolder = $("#modelSpecs");

    // Текст выбранных параметров
    const engine = $('input[name="engine"]:checked + label').text();
    const transmission = $('input[name="transmission"]:checked + label').text();
    const packageText = $('input[name="package"]:checked + label').text();

    // Формируем единое описание
    const text = `${engine}, ${transmission}, ${packageText}.`;

    // Размещаем полученное описание на страницу
    modelSpecsHolder.text(text);
  }
});
