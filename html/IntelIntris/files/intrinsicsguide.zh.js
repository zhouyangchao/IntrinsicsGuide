jQuery.support.cors = true;
var data_js = "", intrinsics = [], allothertechs = [], allcats = [], show, shown = 0, showbuffer, window_height, matches = 0, techs = [], othertechs = [], avx512techs = [], cats = [], text = "", highlighted_token = null, intrin_height = 26, delay_timeout = null;
var delay = function (a, b) {
	if (delay_timeout)
		clearTimeout(delay_timeout);
	delay_timeout = setTimeout(function () {
			delay_timeout = null;
			a.apply(this)
		},
	b);
};
var searchIntrinsic = function (c) {
	var a = false;
	if (techs.length) {
		if ($.inArray(c.tech, techs) != -1 || (c.alsoKNC && $.inArray("KNC", techs) != -1))
			a = true;
	}
	if (othertechs.length && c.tech == "其他") {
		for (var b = 0; b < othertechs.length; b++) {
			if ($.inArray(othertechs[b], c.cpuids) != -1)
				a = true;
		}
	}
	if (avx512techs.length && c.tech == "AVX_512") {
		for (var b = 0; b < avx512techs.length; b++) {
			if ($.inArray(avx512techs[b], c.cpuids) != -1)
				a = true;
		}
	}
	if (techs.length > 0 || othertechs.length > 0 || avx512techs.length > 0) {
		if (!a)
			return false;
	}
	if (cats.length) {
		var d = false;
		for (var b = 0; b < cats.length; b++) {
			if ($.inArray(cats[b], c.categories) != -1)
				d = true;
		}
		if (!d)
			return false;
	}
	if (text.length != 0) {
		if (c._text.indexOf(text) < 0)
			return false;
	}
	return true
};
var search = function () {
	$("#intrinsics_list").css("min-height", "");
	var b = "";
	text = text.toLowerCase();
	if (techs.length == 0 && othertechs.length == 0 && avx512techs.length == 0 && cats.length == 0 && text.length == 0) {
		matches = intrinsics.length;
		shown = 0;
		var a = 0;
		for (var c = 0; c < intrinsics.length; c++) {
			var d = intrinsics[c];
			a++;
			d.match = true;
			if (a < show) {
				shown++;
				d.shown = true;
				d.newlyshown = true;
				b += d._html
			} else
				d.shown = false;
		}
	} else {
		matches = 0;
		shown = 0;
		var a = 0;
		for (var c = 0; c < intrinsics.length; c++) {
			var d = intrinsics[c];
			if (searchIntrinsic(d)) {
				a++;
				d.match = true;
				matches++;
				if (a < show) {
					shown++;
					d.shown = true;
					d.newlyshown = true;
					b += d._html
				} else {
					d.shown = false
				}
			} else {
				d.match = false;
				d.shown = false
			}
		}
	}
	document.getElementById("intrinsics_list").innerHTML = b;
	postProcessHTML();
	$("#intrinsics_list").css("min-height", (matches * intrin_height) + "px")
}
function parseTechs(a) {
	if ($(a).parent().hasClass("othertech")) {
		$("#techs").find(".Other").find("input").prop("checked", false)
	}
	if ($(a).parent().hasClass("Other")) {
		$(".othertech").find("input").each(function () {
			$(this).prop("checked", false)
		})
	}
	if ($(a).parent().hasClass("avx512tech")) {
		$("#techs").find(".AVX_512").find("input").prop("checked", false)
	}
	if ($(a).parent().hasClass("AVX_512")) {
		$(".avx512tech").find("input").each(function () {
			$(this).prop("checked", false)
		})
	}
	techs.length = 0;
	techs = [];
	$(".tech").find("input").each(function () {
		if ($(this).is(":checked")) {
			var b = $(this).parent().attr("class").replace("tech", "").replace(" ", "");
			techs.push(b)
		}
	});
	othertechs.length = 0;
	othertechs = [];
	$(".othertech").find("input").each(function () {
		if ($(this).is(":checked")) {
			var b = $(this).parent().attr("class").replace("othertech", "").replace(" ", "");
			othertechs.push(b)
		}
	});
	if (othertechs.length != 0) {
		$(".Other").find("input").prop("indeterminate", true)
	} else {
		$(".Other").find("input").prop("indeterminate", false)
	}
	avx512techs.length = 0;
	avx512techs = [];
	$(".avx512tech").find("input").each(function () {
		if ($(this).is(":checked")) {
			var b = $(this).parent().attr("class").replace("avx512tech", "").replace(" ", "");
			avx512techs.push(b)
		}
	});
	if (avx512techs.length != 0) {
		$(".AVX_512").find("input").prop("indeterminate", true)
	} else {
		$(".AVX_512").find("input").prop("indeterminate", false)
	}
	search()
}
$("#search").focus(function () {
	var a = $("#search").val();
	if (a == "_mm_搜索") {
		$("#search").css("color", "#000000").val("")
	}
});
$("#search").blur(function () {
	var a = $("#search").val();
	if (a == "") {
		$("#search").css("color", "#aaaaaa").val("_mm_搜索")
	}
});
$("#search").on("input",
	function () {
	text = $("#search").val();
	if (text != "") {
		$("#clear").show();
		delay(search(), 50)
	} else {
		$("#clear").hide();
		search()
	}
});
$("#clear").click(function () {
	text = "";
	$("#search").css("color", "#aaaaaa").val("_mm_搜索");
	$("#clear").hide();
	var b = $("#search").width();
	var c = parseInt($("#search").css("padding-left").replace("px", ""));
	var a = 8;
	$("#search").css("padding-left", a + "px");
	$("#search").width(b - (a - c));
	search()
});
$(".tech").find("input").click(function () {
	parseTechs(this)
});
$(".avx512tech").find("input").click(function () {
	parseTechs(this)
});
var othershow_timeout = null;
var otherhover_timeout = null;
$("#other_techs").hover(function () {
	if (otherhover_timeout) {
		clearTimeout(otherhover_timeout)
	}
},
	function () {
	otherhover_timeout = setTimeout(function () {
			$("#other_techs").slideUp(200);
			otherhover_timeout = null
		},
			300)
});
$("#techs").find(".Other").hover(function () {
	if (otherhover_timeout) {
		clearTimeout(otherhover_timeout)
	}
	othershow_timeout = setTimeout(function () {
			$("#other_techs").slideDown(200);
			othershow_timeout = null
		},
			300)
},
	function () {
	if (othershow_timeout) {
		clearTimeout(othershow_timeout)
	}
	otherhover_timeout = setTimeout(function () {
			$("#other_techs").slideUp(200);
			otherhover_timeout = null
		},
			300)
});
var avx512show_timeout = null;
var avx512hover_timeout = null;
$("#avx512_techs").hover(function () {
	if (avx512hover_timeout) {
		clearTimeout(avx512hover_timeout)
	}
},
	function () {
	avx512hover_timeout = setTimeout(function () {
			$("#avx512_techs").slideUp(200);
			avx512hover_timeout = null
		},
			300)
});
$("#techs").find(".AVX_512").hover(function () {
	if (avx512hover_timeout) {
		clearTimeout(avx512hover_timeout)
	}
	avx512show_timeout = setTimeout(function () {
			$("#avx512_techs").slideDown(200);
			avx512hover_timeout = null
		},
			300)
},
	function () {
	if (avx512show_timeout) {
		clearTimeout(avx512show_timeout)
	}
	avx512hover_timeout = setTimeout(function () {
			$("#avx512_techs").slideUp(200);
			avx512hover_timeout = null
		},
			300)
});
var popbox_timeout = null;
$(".popbox").hover(function () {
	if (popbox_timeout) {
		clearTimeout(popbox_timeout)
	}
},
	function () {
	popbox_timeout = setTimeout(function () {
			$(".popbox").hide();
			popbox_timeout = null
		},
			300)
});
function noteOver() {
	$(".popbox").hide();
	if (popbox_timeout) {
		clearTimeout(popbox_timeout)
	}
	var f = $(this);
	var b = $(".popbox." + f.attr("note-type"));
	var g = f.offset();
	var d = g.top + f.height() + 5;
	var c = g.left + (f.width() / 2) - (b.width() / 2);
	b.css({
		top : d + "px",
		left : c + "px"
	}).show();
	var a = f.text().replace("(v)", "");
	$(".base").html(a)
}
function noteOut() {
	popbox_timeout = setTimeout(function () {
			$(".popbox").hide();
			popbox_timeout = null
		},
			300)
}
function postProcessHTML() {
	for (var a = 0; a < intrinsics.length; a++) {
		var b = intrinsics[a];
		if (b.newlyshown) {
			b.newlyshown = false;
			b.elem = $("#" + b.id);
			b.elem.find(".signature").click(function () {
				var d = $(this).parent();
				var c = d.find(".details");
				if (c.css("display") == "none") {
					c.slideDown(200);
					d.find(".instruction_note").on("mouseover", noteOver);
					d.find(".instruction_note").on("mouseout", noteOut)
				} else {
					c.slideUp(200);
					d.find(".desc_var").off("mouseenter mouseout");
					d.find(".param_name").off("mouseenter mouseout");
					d.find(".cpuid").off("mouseenter mouseout");
					d.find(".instruction_note").off("mouseenter mouseout")
				}
			})
		}
	}
}
function windowScroll() {
	if ($(".intrinsic").length) {
		var f = $(window).scrollTop();
		var e = $(".intrinsic").last().offset().top;
		if (f + window_height + showbuffer > e) {
			var a = 0;
			var b = "";
			var c = Math.ceil((f + window_height + showbuffer - e) / intrin_height) + 3;
			$("#intrinsics_list").css("min-height", (matches * intrin_height) + "px");
			for (var d = 0; d < intrinsics.length && a < c; d++) {
				var g = intrinsics[d];
				if (g.match && !g.shown) {
					a++;
					shown++;
					g.shown = true;
					g.newlyshown = true;
					b += g._html
				}
			}
			$("#intrinsics_list").append(b);
			delay(postProcessHTML(), 100)
		}
	}
}
$(window).scroll(windowScroll);
function windowSize() {
	window_height = $(window).height();
	var a = Math.ceil(window_height / intrin_height);
	show = a * 2;
	showbuffer = a * intrin_height
}
$(window).resize(function () {
	windowSize();
	windowScroll()
});
function initialPass(a) {
	$(a).find("intrinsic").each(function () {
		var c = $(this);
		var b = c.attr("name").toLowerCase();
		var d;
		if (b.indexOf("_mm") >= 0 || b.indexOf("_m_") >= 0) {
			d = b.substring(b.indexOf("_", 1) + 1);
			if (d.indexOf("mask_") == 0 || d.indexOf("maskz_") == 0 || d.indexOf("mask2_") == 0 || d.indexOf("mask3_") == 0 || d.indexOf("mmask_") == 0) {
				d = d.substring(d.indexOf("_", 1) + 1)
			}
		} else {
			d = b.substring(b.indexOf("_") + 1);
			if (d.charAt(0) == "_") {
				d = d.substring(b.indexOf("_") + 1)
			}
		}
		c.base = d;
		intrinsics.push(c)
	});
	intrinsics.sort(function (d, c) {
		var e = d.base.localeCompare(c.base);
		if (e == 0) {
			e = d.attr("name").localeCompare(c.attr("name"))
		}
		return e
	})
}
function renderPass() {
	var f = (window.location.hash == "#showall");
	var m = "";
	for (l = 0; l < intrinsics.length; l++) {
		$intrinsic = intrinsics[l];
		$intrinsic.header = $intrinsic.find("header").text();
		var s = $intrinsic.attr("name");
		var n = $intrinsic.find("instruction");
		$intrinsic.alsoKNC = false;
		$intrinsic.tech = $intrinsic.attr("tech").replace(".", "_").replace("-", "_").replace(" ", "_");
		if ($intrinsic.tech.indexOf("/KNC") >= 0) {
			$intrinsic.tech = $intrinsic.tech.replace("/KNC", "");
			$intrinsic.alsoKNC = true
		}
		$intrinsic.categories = [];
		$intrinsic.find("category").each(function () {
			var j = $(this).text();
			$intrinsic.categories.push(j);
			if ($.inArray(j, allcats) == -1) {
				allcats.push(j)
			}
		});
		var p = "";
		$intrinsic.cpuids = [];
		$intrinsic.find("CPUID").each(function () {
			var v = $(this).text();
			$intrinsic.cpuids.push(v.replace(".", "_").replace("-", "_").replace(" ", "_").replace("/KNCNI", ""));
			if ($intrinsic.tech == "Other") {
				if ($.inArray(v, allothertechs) == -1) {
					allothertechs.push(v)
				}
			}
			if (v.indexOf("/") >= 0) {
				var u = v.split("/");
				var j = $intrinsic.attr("tech").split("/");
				v = "";
				for (var t = 0; t < u.length; t++) {
					if (v != "") {
						v += ", "
					}
					v += "<span class='cpuid'>" + u[t] + "</span> for " + j[t]
				}
				if (p != "") {
					p += ", "
				}
				p += v
			} else {
				if (p != "") {
					p += " + "
				}
				p += "<span class='cpuid'>" + v + "</span>"
			}
		});
		$intrinsic.cpuid = p;
		var e = "<span class='sig'><span class='rettype'>" + $intrinsic.attr("rettype") + "</span> <span class='name'>" + s + "</span> (";
		var k = 0;
		$intrinsic.find("parameter").each(function () {
			var t = $(this);
			if (k > 0) {
				e += ", "
			}
			e += "<span class='param_type'>" + t.attr("type") + "</span>";
			var j = t.attr("varname");
			if (j) {
				e += " <span class='param_name'>" + j + "</span>"
			}
			k++
		});
		e += ")</span>";
		$intrinsic.signature = e;
		var r = $intrinsic.find("description").first().text();
		if (r.indexOf("_note]") > 0) {
			r = r.replace(/\[round_note\]/g, "<br />Rounding is done according to the \"rounding\" parameter, which can be one of:<div class='desc_note'>    (_MM_FROUND_TO_NEAREST_INT |_MM_FROUND_NO_EXC) // round to nearest, and suppress exceptions\n    (_MM_FROUND_TO_NEG_INF |_MM_FROUND_NO_EXC)     // round down, and suppress exceptions\n    (_MM_FROUND_TO_POS_INF |_MM_FROUND_NO_EXC)     // round up, and suppress exceptions\n    (_MM_FROUND_TO_ZERO |_MM_FROUND_NO_EXC)        // truncate, and suppress exceptions\n    _MM_FROUND_CUR_DIRECTION // use MXCSR.RC; see _MM_SET_ROUNDING_MODE</div>").replace(/\[strcmp_note\]/g, "<br />\"imm\" can be a combination of:<div class='desc_note'>    _SIDD_UBYTE_OPS                // unsigned 8-bit characters\n    _SIDD_UWORD_OPS                // unsigned 16-bit characters\n    _SIDD_SBYTE_OPS                // signed 8-bit characters\n    _SIDD_SWORD_OPS                // signed 16-bit characters\n    _SIDD_CMP_EQUAL_ANY            // compare equal any\n    _SIDD_CMP_RANGES               // compare ranges\n    _SIDD_CMP_EQUAL_EACH           // compare equal each\n    _SIDD_CMP_EQUAL_ORDERED        // compare equal ordered\n    _SIDD_NEGATIVE_POLARITY        // negate results\n    _SIDD_MASKED_NEGATIVE_POLARITY // negate results only before end of string\n    _SIDD_LEAST_SIGNIFICANT        // index only: return last significant bit\n    _SIDD_MOST_SIGNIFICANT         // index only: return most significant bit\n    _SIDD_BIT_MASK                 // mask only: return bit mask\n    _SIDD_UNIT_MASK                // mask only: return byte/word mask</div>").replace(/\[getmant_note\]/g, "<br />The mantissa is normalized to the interval specified by \"interv\", which can take the following values:<div class='desc_note'>    _MM_MANT_NORM_1_2     // interval [1, 2)\n    _MM_MANT_NORM_p5_2    // interval [0.5, 2)\n    _MM_MANT_NORM_p5_1    // interval [0.5, 1)\n    _MM_MANT_NORM_p75_1p5 // interval [0.75, 1.5)</div>The sign is determined by \"sc\" which can take the following values:<div							 class='desc_note'>    _MM_MANT_SIGN_src     // sign = sign(src)\n    _MM_MANT_SIGN_zero    // sign = 0\n    _MM_MANT_SIGN_nan     // dst = NaN if sign(src) = 1</div>").replace(/\[fpclass_note\]/g, "<br />\"imm\" can be a combination of:<div class='desc_note'>    0x01 // QNaN\n    0x02 // Positive Zero\n    0x04 // Negative Zero\n    0x08 // Positive Infinity\n    0x10 // Negative Infinity\n    0x20 // Denormal\n    0x40 // Negative\n    0x80 // SNaN</div>")
		}
		r = r.replace(/\"([^\"]+)\"/g, "<span class='desc_var $1'>$1</span>");
		$intrinsic.description = r;
		var h = "";
		var q = $intrinsic.find("operation");
		if (q) {
			h = $.trim(q.last().text())
		}
		var a = "";
		n.each(function () {
			if (a != "") {
				a += ", "
			}
			a += $(this).attr("name")
		});
		var b = a;
		var o = "";
		if ($intrinsic.attr("sequence")) {
			a = "Sequence";
			b = "...";
			o = "sequence"
		}
		if ($intrinsic.attr("vexEq")) {
			a = "(v)" + a;
			if ($intrinsic.attr("dontShowZeroUnmodMsg")) {
				o = "vexeq"
			} else {
				o = "vexeq-hazard"
			}
		}
		$intrinsic.instruction = b;
		$intrinsic.id = l;
		var d = "<div class='intrinsic " + $intrinsic.tech + "' id='" + $intrinsic.id + "'>";
		if ($intrinsic.alsoKNC) {
			d += "<div class='alsoKNC'></div>"
		}
		if (b != "") {
			d += "<div class='instruction'>" + b + "</div>"
		}
		d += "<div class='signature'>" + e + "</div><div class='details'><h1>概要</h1><div class='synopsis'>" + e + '<br />#include "' + $intrinsic.header + '"<br />';
		if (n.length > 0) {
			d += "Instruction: ";
			var g = 0;
			n.each(function () {
				if (g > 0) {
					d += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
				}
				if (o != "") {
					d += "<span class='instruction_note' note-type='" + o + "'>" + $(this).attr("name") + "</span>"
				} else {
					d += $(this).attr("name")
				}
				if ($(this).attr("form")) {
					d += " " + $(this).attr("form")
				}
				d += "<br />";
				g++
			})
		}
		if (p) {
			d += "CPUID Flags: " + p
		}
		d += "</div><h1>说明</h1><div class='description'>" + r + "</div>";
		if (h != "") {
			d += "<h1>操作</h1><div class='operation'>" + h + "</div>"
		}
		var c = $intrinsic.find("perfdata");
		if (c.length) {
			d += "<br /><h1>性能</h1><table class='performance'><tr><th>架构</th><th>延迟</th><th>吞吐</th></tr>";
			c.each(function () {
				if (!$(this).attr("tpt")) {
					$(this).attr("tpt", "-")
				}
				d += "<tr><td>" + $(this).attr("arch") + "</td><td>" + $(this).attr("lat") + "</td><td>" + $(this).attr("tpt") + "</td></tr>"
			});
			d += "</table>"
		}
		d += "</div></div>";
		$intrinsic._html = d;
		$intrinsic.match = true;
		$intrinsic.shown = false;
		$intrinsic.newlyshown = false;
		if (l < show || f) {
			m += d;
			$intrinsic.shown = true;
			$intrinsic.newlyshown = true;
			shown++
		}
	}
	matches = intrinsics.length;
	document.getElementById("intrinsics_list").innerHTML = m;
	postProcessHTML();
	$("#intrinsics_list").css("min-height", ($("#intrinsics_list").height() + (matches - shown) * intrin_height) + "px");
	allothertechs.sort();
	for (var l = 0; l < allothertechs.length; l++) {
		$("#other_techs").append("<div class='" + allothertechs[l].replace(".", "_").replace("-", "_").replace(" ", "_") + " othertech'><input type='checkbox' /> " + allothertechs[l] + "</div>")
	}
	allcats.sort();
	for (var l = 0; l < allcats.length; l++) {
		$("#categories").append("<div class='category'><input type='checkbox' /> <span>" + allcats[l] + "</span></div>")
	}
	$(".othertech").find("input").click(function () {
		parseTechs(this)
	});
	$(".category").find("input").click(function () {
		cats.length = 0;
		cats = [];
		$(".category").find("input").each(function () {
			if ($(this).is(":checked")) {
				var j = $(this).parent().find("span").html();
				cats.push(j)
			}
		});
		search()
	})
}
function finalPass() {
	for (i = 0; i < intrinsics.length; i++) {
		$intrinsic = intrinsics[i];
		$intrinsic._text = ($($intrinsic.signature).text() + "\n" + $intrinsic.header + "\n" + $intrinsic.instruction + "\n" + $($intrinsic.cpuid).text() + "\n" + $("<div>" + $intrinsic.description + "</div>").text()).toLowerCase()
	}
}
$(window).load(function () {
	$("#other_techs").hide();
	$("#avx512_techs").hide();
	windowSize();
	$.ajax({
		url : "files/data.zh.xml",
		crossDomain : true,
		success : function (b) {
			$(".info").prepend("Data Version: " + $(b).find("intrinsics_list").attr("version") + " - <a href='files/ReleaseNotes.html' target='_blank'>Release Notes</a><br />Data Updated: " + $(b).find("intrinsics_list").attr("date") + "<br /><br />");
			$("#info").css("color", "rgb(8,114,197)");
			initialPass(b)
		},
		complete : function (c, b) {
			if (b == "success") {
				renderPass();
				finalPass()
			}
		},
		error : function (b, d, c) {
			if (data_js != "") {
				initialPass(data_js);
				renderPass();
				finalPass()
			} else {
				document.getElementById("intrinsics_list").innerHTML = "Error Loading Data";
				$(".info").prepend("Error: " + d + "<br />Exception: " + c + "<br /><br />");
				$("#info").css("color", "rgb(197,114,8)")
			}
		}
	});
	$("#info").on("mouseenter",
		function () {
		$(".popbox").hide();
		if (popbox_timeout) {
			clearTimeout(popbox_timeout)
		}
		var f = $(this);
		var b = $(".popbox.info");
		var g = f.offset();
		var d = g.top + f.height() + 5;
		var c = g.left + (f.width() / 2) - (b.width() / 2);
		if (c + b.width() + 30 >= $(window).width()) {
			c = $(window).width() - b.width() - 30
		}
		b.css({
			top : d + "px",
			left : c + "px"
		}).show()
	});
	$("#info").on("mouseout",
		function () {
		popbox_timeout = setTimeout(function () {
				$(".popbox").hide();
				popbox_timeout = null
			},
				300)
	});
	$("#close").click(function () {
		$("#about").slideUp(100);
		document.cookie = "about=closed;"
	});
	var a = document.cookie;
	if (a.indexOf("about=closed") < 0) {
		$("#about").slideDown(100)
	}
});
