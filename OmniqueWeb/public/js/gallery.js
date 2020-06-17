$(document).ready(function () {
    // do an A-Z sort on ready
    sortBy('atoz')

    // apply listeners
    $('.sort-radio').click(function () {
        var option = $('.sort-radio:checked').val()
        sortBy(option)
    })

    $('.sort-check').click(function () {
        var filters = []
        $('.sort-check:checked').each(function () {
            filters.push($(this).val())
        })
        filterBy(filters)
    })
})

// sorts alphabetically, reverse alphabetically and price asc or desc
function sortBy(option) {
    // get gallery container
    var $gallery = $('.gallery')

    // init elements in case no match
    var $elements = $gallery.find('.product')

    // pick relevant option and sort
    switch (option) {
        case 'atoz':
            {
                $elements = $gallery.find('.product').sort(function (a, b) {
                    if (a.dataset.name < b.dataset.name) { return -1; }
                    if (a.dataset.name > b.dataset.name) { return 1; }
                    return 0;
                })
            }
            break;
        case 'ztoa':
            {
                $elements = $gallery.find('.product').sort(function (a, b) {
                    if (b.dataset.name < a.dataset.name) { return -1; }
                    if (b.dataset.name > a.dataset.name) { return 1; }
                    return 0;
                })
            }
            break;
        case 'lowtohigh':
            {
                $elements = $gallery.find('.product').sort(function (a, b) {
                    return +a.dataset.price - +b.dataset.price
                })
            }
            break;
        case 'hightolow':
            {
                $elements = $gallery.find('.product').sort(function (a, b) {
                    return +b.dataset.price - +a.dataset.price
                })
            }
            break;
    }

    // apply sort to gallery
    $elements.appendTo($gallery)
}

// obscures/shows products based on given filters
function filterBy(filters) {
    // extract filters, hide/show relavent ones

    $('.product').each(function () {
        // get applied categories (which are stored as classes)
        var classes = $(this).find('.product-card').attr('class').split(/\s+/)
        // see if we have ANY match
        var match = classes.some(c => filters.includes(c))
        if (match) {
            $(this).fadeIn()
        }
        else {
            $(this).fadeOut()
        }
    })
}

