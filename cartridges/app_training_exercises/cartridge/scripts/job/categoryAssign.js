"use strict";

var Loogger = require("dw/system/Logger");
var Status = require("dw/system/Status");
var ProductMgr = require("dw/catalog/ProductMgr");
var CatalogMgr = require("dw/catalog/CatalogMgr");
var ProductSearchModel = require("dw/catalog/ProductSearchModel");
var File = require("dw/io/File");
var FileWriter = require("dw/io/FileWriter");
var XMLStreamWriter = require("dw/io/XMLIndentingStreamWriter");

function execute(args) {
    var productSearch = new ProductSearchModel();

    var categoryAssignFile = new File(File.IMPEX + File.SEPARATOR + "catalog.xml");
    var categoryFileWriter = new FileWriter(categoryAssignFile, "UTF-8");
    var categoryXmlWriter = new XMLStreamWriter(categoryFileWriter);
    var productsIterator;
    var product;
    try {
        productSearch.addRefinementValues("brand", args.brand);
        productSearch.search();
        categoryXmlWriter.writeStartDocument();
        categoryXmlWriter.writeStartElement("catalog");
        categoryXmlWriter.writeAttribute(
            "xmlns",
            categoryXmlWriter.defaultNamespace || "http://www.demandware.com/xml/impex/catalog/2006-10-31"
        );
        categoryXmlWriter.writeAttribute("catalog-id", CatalogMgr.getSiteCatalog().ID);
        productsIterator = productSearch.getProductSearchHits();
        while (productsIterator !== null && productsIterator.hasNext()) {
            product = productsIterator.next().getProduct();
            categoryXmlWriter.writeStartElement("category-assignment");
            categoryXmlWriter.writeAttribute("category-id", args.category);
            categoryXmlWriter.writeAttribute("product-id", product.ID);
            categoryXmlWriter.writeStartElement("primary-flag");
            categoryXmlWriter.writeCharacters("true");
            categoryXmlWriter.writeEndElement();
        }
        categoryXmlWriter.writeEndElement();
        categoryXmlWriter.writeEndDocument();
        categoryXmlWriter.close();
        categoryFileWriter.close();
    } catch (error) {
        Loogger.error("Error occured when trying to run JOB:" + error.message);
        return new Status(Status.ERROR, "ERROR");
    }
    Loogger.info("Assigned all products to category" + args.category);
    return new Status(Status.OK, "OK");
}

exports.execute = execute;
