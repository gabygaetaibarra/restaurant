$(function() {	                                //Equivale a document.addEventListener("DOMContentLoaded"...
  $("#navbarToggle").blur(function(evento) {	//document.querySelector("#navbarToggle").addEventListener("blur",...
    var anchoventana=window.innerWidth;
    if (anchoventana<768) {
      $("#collapsable-nav").collapse('hide');
    }
  });
  $("#navbarToggle").click(function(evento) {
    $(evento.target).focus();
  });
});
(function(global) {
  var dc={};
  var iniHtml="snippets/snippetini.html";
  var urlscategorias="https://davids-restaurant.herokuapp.com/categories.json";
  var titulocategoriaHtml="snippets/tituloscategorias.html";
  var catHtml="snippets/snippetcateg.html";
  var urlsitems="https://davids-restaurant.herokuapp.com/menu_items.json?category=";
  var titulositems="snippets/titulositems.html";
  var htmlitem="snippets/item.html";
  var insertHtml=function(selector,html) {        //Función conveniente p/insertar innerHTML por 'select'
    var destinoElem=document.querySelector(selector);
    destinoElem.innerHTML=html;
  };
  var mostrarCarga=function(selector) {           //Muestra icono en el elemento identificado por 'selector'
  	var html="<div class='text-center'>";
  	html+="<img src='images/loading.gif'></div>";
  	insertHtml(selector,html);
  };
  var inspropiedad=function(string,nomespecial,valoresp) {          //Sustituye cada {{nomespecial}} con valoresp
    var reemplprop="{{" +nomespecial+"}}";
    string=string.replace(new RegExp(reemplprop,"g"),valoresp);
    console.log("Todo bien en especiales")                                        //OJO AQUÍ
  return string;
  }
//Cargar la página antes de las imágenes o CSS | On first load, show home view
  document.addEventListener("DOMContentLoaded",function(evento) {
	mostrarCarga("#contenidoprincipal"); 
	$utilsajax.sendGetRequest(iniHtml,function(responseText) {
	  document.querySelector("#contenidoprincipal").innerHTML=responseText;
	},
  false);
});
//Cargar la vista de categorías del menú
dc.loadMenuCategories=function() {
  mostrarCarga("#contenidoprincipal");
  $utilsajax.sendGetRequest(urlscategorias,construyemuestracategorias);
};
//ESTO SE AGREGÓ | Cargar vista elementos del menú 'nomcortocat' es nombre corto para 1 categoría
dc.loadMenuItems=function(nomcortocat) {
  mostrarCarga("#contenidoprincipal");
  $utilsajax.sendGetRequest(urlsitems+nomcortocat,construyemuestraitems);
};
//Crea HTML para pág categorías en función datos servidor | Cargar título página categorías
function construyemuestracategorias(categories) {
  $utilsajax.sendGetRequest(titulocategoriaHtml,function(titulocategoriaHtml) {   //Recuperar frag de 1 categoría
    $utilsajax.sendGetRequest(catHtml,function(catHtml) {
      var vercategoriasHtml=construyecategorias(categories,titulocategoriaHtml,catHtml);
      insertHtml("#contenidoprincipal",vercategoriasHtml);
    },
    false);
  },
  false);
}
//Usando categorías, datos y fragmentos, html, construya categorías, ver el HTML que se insertará
function construyecategorias(categories,titulocategoriaHtml,catHtml) {
  var finalHtml=titulocategoriaHtml;
  finalHtml+="<section class='row'>";       //Bucle sobre categorías e inserte valores de categoría
  console.log("DENTRO DE construyecategorias");
  for (var i=0; i<categories.length; i++) {
    var html=catHtml;
    var name="" +categories[i].name;
    var short_name=categories[i].short_name;
    html=inspropiedad(html,"name",name);
    html=inspropiedad(html,"short_name",short_name);
    finalHtml+=html;
  }
  finalHtml+="</section>";
  return finalHtml;
}
// Builds HTML for the single category page based on the data from the server | Load title snippet of menu items page |Retrieve single menu item snippet
function construyemuestraitems(categoriaitems) {
  $utilsajax.sendGetRequest(titulositems,function(titulositems) {
    $utilsajax.sendGetRequest(htmlitem,function(htmlitem) {
      var vistasitems=hacervistasitems(categoriaitems,titulositems,htmlitem);
      insertHtml("#contenidoprincipal",vistasitems);
    },
    false);
  },
  false);
}
// Using category and menu items data and snippets html build menu items view HTML to be inserted into page
function hacervistasitems(categoriaitems,titulositems,htmlitem) {
  titulositems=inspropiedad(titulositems,"name",categoriaitems.category.name);
  titulositems=inspropiedad(titulositems,"special_instructions",categoriaitems.category.special_instructions);
  var finalHtml=titulositems;
  finalHtml+="<section class='row'>";
  // Loop over menu items | Insert menu item values
  var menuItems=categoriaitems.menu_items;
  var apodocateg=categoriaitems.category.short_name;
  for (var i=0; i<menuItems.length; i++) {
    console.log("ESPECIALES ?")
    var html=htmlitem;
    html=inspropiedad(html,"short_name",menuItems[i].short_name);
    html=inspropiedad(html,"catShortName",apodocateg);
    html=insertprecio(html,"price_small",menuItems[i].price_small);
    html=insertporcion(html,"small_portion_name",menuItems[i].small_portion_name);
    html=insertprecio(html,"price_large",menuItems[i].price_large);
    html=insertporcion(html,"large_portion_name",menuItems[i].large_portion_name);
    html=inspropiedad(html,"name",menuItems[i].name);
    html=inspropiedad(html,"description",menuItems[i].description);
    // Add clearfix after cada 2 items
    if (i%2 !=0) {
      html+="<div class='clearfix visible-lg-block visible-md-block'></div>";
    }
    finalHtml+=html;
  }
  finalHtml+="</section>";
  return finalHtml;
}
// Appends price with '$' if price exists | If not specified, replace with empty string
function insertprecio(html,nomprecio,valorprecio) {
  if (!valorprecio) {
    return inspropiedad(html,nomprecio,"");;
  }
  valorprecio="$" + valorprecio.toFixed(2);
  html=inspropiedad(html,nomprecio,valorprecio);
  return html;
}
//Agrega nombre de porción entre paréntesis si existe, si no hay, devuelve cadena original
function insertporcion(html,nombreporcion,valorporcion) {
  if (!valorporcion) {
    return inspropiedad(html,nombreporcion,"");
  }
  valorporcion="(" + valorporcion + ")";
  html=inspropiedad(html,nombreporcion,valorporcion);
  return html;
}
global.$dc=dc;
})(window);