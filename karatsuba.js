function simplify(num) {
  if (num[0] === '0') {
    while (num.length && num[0] === '0') {
      num = num.slice(1);
    }
  }

  return num.length ? num : '0';
}

function normalize(num, length) {
  var nlen = num.length;
  return nlen === length ? num : Array(length - nlen + 1).join('0') + num;
}

function high(num, length) {
  return num.slice(0, -length);
}

function low(num, length) {
  return num.slice(-length);
}

function add(x, y) {
  var m = Math.max(x.length, y.length);
  var nx = normalize(x, m).split(''),
      ny = normalize(y, m).split('');

  var z = Array(m);
  var carry = 0;
  for (var i = m - 1; i >= 0; i--) {
    var sum = parseInt(nx[i]) + parseInt(ny[i]) + carry;
    carry = +(sum >= 10);
    z[i] = carry ? sum - 10 : sum;
  }

  return z.join('');
}

function sub(x, y) {
  var m = Math.max(x.length, y.length);
  var nx = normalize(x, m).split(''),
      ny = normalize(y, m).split('');

  var z = Array(m);
  for (var i = 0; i < m; i++) {
    var sub = parseInt(nx[i]) - parseInt(ny[i]);
    var carry = sub < 0;
    if (i && carry) {
      z[i - 1] -= 1;
    }

    z[i] = i > 0 && carry ? 10 + sub : sub;
  }

  return z.join('');
}

function kpow(x, y) {
  return x + Array(y + 1).join('0');
}

module.exports = function karatsuba(x, y) {
  var sx = simplify(x),
      sy = simplify(y);

  if (!(sx.length - 1) || !(sy.length - 1)) {
    return '' + (parseInt(sx) * parseInt(sy));
  }

  var m = Math.max(sx.length, sy.length);
  var m2 = Math.floor(m / 2);

  var nx = normalize(sx, m);
      ny = normalize(sy, m);

  var hx = high(nx, m2),
      lx = low(nx, m2),
      hy = high(ny, m2),
      ly = low(ny, m2);

  var z0 = karatsuba(lx, ly),
      z1 = karatsuba(hx, hy),
      z2 = karatsuba(add(lx, hx), add(ly, hy));

  console.log('hx ' + hx + ', lx ' + lx + ', hy ' + hy + ', ly ' + ly + ', z0 ' + z0 + ', z1 ' + z1 + ', z2 ', z2);
  return add(add(z0, kpow(z1, m2 * 2)), kpow(sub(sub(z2, z1), z0), m2));
}
