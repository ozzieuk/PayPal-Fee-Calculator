function get_float(string) {
    var to_return = parseFloat(string);
    if (typeof to_return == 'undefined') {
        to_return = 0.00
    }
    if (isNaN(to_return)) {
        to_return = 0.00
    }
    to_return = (to_return / 100) * 100;
    return to_return
}
function get_key_code(e) {
    if (typeof e == "undefined") {
        e = window.event
    }
    if (e.keyCode) {
        return e.keyCode
    } else if (e.which) {
        return e.which
    } else {
        return e.charCode
    }
}
function has_selection(ele) {
    var txt = '',
        len = 0,
        start = 0,
        end = 0;
    if (document.selection) {
        txt = document.selection.createRange().text
    } else if (window.getSelection) {
        txt = window.getSelection()
    } else if (document.getSelection) {
        txt = document.getSelection()
    } else {
        return false
    }
    if (ele.selectionStart) {
        start = ele.selectionStart
    }
    if (ele.selectionEnd) {
        end = ele.selectionEnd
    }
    len = end - start;
    if (len > 0) {
        return true
    } else if (typeof txt == "undefined") {
        return false
    } else if (isNaN(txt)) {
        return false
    } else if (txt.length > 0) {
        return true
    } else {
        return false
    }
}
function textbox_onkeypress(e) {
    if (typeof e == "undefined") {
        e = window.event
    }
    var keycode = get_key_code(e);
    var to_return = true;
    switch (keycode) {
        case 8:
            break;
        case 9:
            break;
        case 13:
            break;
        case 37:
        case 39:
            break;
        case 38:
            if (this.value != '') {
                this.value = (get_float(this.value) + 0.5).toFixed(2)
            }
            break;
        case 40:
            if (get_float(this.value) >= 0.5) {
                this.value = (get_float(this.value) - 0.5).toFixed(2)
            } else {
                this.value = '0.00'
            }
            if (this.id == 'to_receive') {
                rp_calc()
            } else if (this.id == 'if_you_receive') {
                p_calc()
            }
            break;
        case 46:
            if (this.value.indexOf(".") != -1) {
                if (has_selection(this) == false) {
                    to_return = false
                }
            }
            break;
        case 48:
        case 49:
        case 50:
        case 51:
        case 52:
        case 53:
        case 54:
        case 55:
        case 56:
        case 57:
            if ((this.id != 'paypal_fee_percent')) {
                if (this.value.length >= 3) {
                    if (this.value.substr(this.value.length - 3, 1) == '.') {
                        if (has_selection(this) == false) {
                            to_return = false
                        }
                    }
                }
            }
            break;
        default:
            to_return = false
    }
    if ((!e.which) && (keycode == 46)) {
        to_return = true
    }
    if ((typeof e.which == "undefined") && (keycode == 46) && (this.value.indexOf(".") != -1) && (has_selection(this) == false)) {
        to_return = false
    }
    e.returnValue = to_return;
    return to_return
}
function set_rate(percent, fixed, sign, name) {
    document.forms['ppc'].elements['paypal_fee_percent'].value = percent;
    document.forms['ppc'].elements['paypal_fee_fixed'].value = fixed;
    document.getElementById('currency_sign').innerHTML = sign;
    document.getElementById('currency_name').innerHTML = name;
    document.getElementById('currency_symbol_1').innerHTML = sign;
    document.getElementById('currency_symbol_2').innerHTML = sign;
    document.getElementById('currency_symbol_3').innerHTML = sign;
    document.getElementById('currency_symbol_4').innerHTML = sign;
    document.getElementById('currency_symbol_5').innerHTML = sign
}
function figure_fees(item_price, fee_percentage, fixed_fee) {
    var the_fee_percentage = fee_percentage / 100;
    the_fee_percentage = the_fee_percentage.toFixed(4);
    the_fee_percentage = get_float(the_fee_percentage);
    var to_return = item_price * the_fee_percentage + fixed_fee;
    to_return = Math.round(to_return * 100) / 100;
    to_return = to_return.toFixed(2);
    to_return = get_float(to_return);
    if (to_return > item_price) {
        to_return = item_price
    }
    return to_return
}
function p_calc() {
    if (document.forms['ppc'].elements['if_you_receive'].value != '') {
        var amount_sent = get_float(document.forms['ppc'].elements['if_you_receive'].value);
        if (amount_sent == 0) {
            document.forms['ppc'].elements['paypal_fees'].value = document.forms['ppc'].elements['you_would_receive'].value = '0.00'
        } else {
            var the_paypal_fees = figure_fees(amount_sent, get_float(document.forms['ppc'].elements['paypal_fee_percent'].value), get_float(document.forms['ppc'].elements['paypal_fee_fixed'].value));
            document.forms['ppc'].elements['paypal_fees'].value = the_paypal_fees.toFixed(2);
            var amount_after_fees = amount_sent - get_float(document.forms['ppc'].elements['paypal_fees'].value);
            if (amount_after_fees < 0) {
                amount_after_fees = 0
            }
            document.forms['ppc'].elements['you_would_receive'].value = amount_after_fees.toFixed(2)
        }
    } else {
        document.forms['ppc'].elements['paypal_fees'].value = '';
        document.forms['ppc'].elements['you_would_receive'].value = ''
    }
}
function rp_calc(src) {
    if (document.forms['ppc'].elements['to_receive'].value != '') {
        var desired_amount = get_float(document.forms['ppc'].elements['to_receive'].value);
        if (desired_amount == 0) {
            document.forms['ppc'].elements['a_person_would'].value = '0.00'
        } else {
            var a_person_must_send = (desired_amount + get_float(document.forms['ppc'].elements['paypal_fee_fixed'].value)) / (1 - (get_float(document.forms['ppc'].elements['paypal_fee_percent'].value) / 100).toFixed(4));
            document.forms['ppc'].elements['a_person_would'].value = a_person_must_send.toFixed(2);
            document.forms['ppc'].elements['if_you_receive'].value = document.forms['ppc'].elements['a_person_would'].value;
            p_calc()
        }
    } else {
        if (src != 1) {
            document.forms['ppc'].elements['a_person_would'].value = '';
            document.forms['ppc'].elements['if_you_receive'].value = ''
        }
        p_calc()
    }
}
if (window.addEventListener) {
    window.addEventListener("load", window_onload, false)
} else if (window.attachEvent) {
    window.attachEvent("onload", window_onload)
}
function window_onload() {
    document.forms['ppc'].elements['to_receive'].onkeypress = textbox_onkeypress;
    document.forms['ppc'].elements['if_you_receive'].onkeypress = textbox_onkeypress;
    document.forms['ppc'].elements['paypal_fee_percent'].onkeypress = textbox_onkeypress;
    document.forms['ppc'].elements['paypal_fee_fixed'].onkeypress = textbox_onkeypress;
    document.forms['ppc'].elements['to_receive'].onkeyup = rp_calc;
    document.forms['ppc'].elements['if_you_receive'].onkeyup = p_calc;
    document.forms['ppc'].elements['to_receive'].focus()
}