<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { browser } from '$app/environment';

  function LRemainder(n: number, limit1: number, limit2: number, offset: number): number {
    return ((n - limit1) / (limit2 - limit1)) * (limit2 - offset) + offset;
  }

  let t = 0;
  let intervalId: NodeJS.Timeout;

  onMount(() => {
    if (browser) {
      const saved = localStorage.getItem('ordinal_lngi_rewritten');
      t = saved ? Number(saved) : 0;

      intervalId = setInterval(() => {
        t = Math.min(t + 1, 125000)
        localStorage.ordinal_lngi_rewritten = t
      }, 16.666666666666666666);
      // }, 0);
    }
  });

  onDestroy(() => {
    if (intervalId) clearInterval(intervalId);
  });

  function Infinitize(n: number) {
    return 1/(1-n)-1
  }
  
  function InversedInfinitize(n: number) {
    return 1 - 1 / (n + 1)
  }

  function LogInfinitize(n: number, base = 2) {
    return -Math.log(1-n) / Math.log(base)
  }
  
  function InversedLogInfinitized(n: number, base = 2) {
    return 1 - base ** -n
  }

  function roundFloat(x: number, precision: number = 14): number {
    return Number(x.toFixed(precision));
  }

  function ordinal(x: number, top=true): string {
    if (x < 3000) {
      return String(Math.floor(Infinitize(x / 3000)))
    } else if (x < 10000) {
      let a = Infinitize((x - 3000) / 14000 + 0.5)
      let b = Math.floor(a)
      let c = Math.floor(Infinitize(a - b))
      return "ω" + (b == 1 ? "" : b) + (c == 0 ? "" : "+" + c )
    } else if (x < 30000) {
      let a = roundFloat(Infinitize((x - 10000) / 60000 + 2 / 3), 14)
      let b = Math.floor(a)
      let c = Infinitize((a - b) / 2 + 0.5)
      let d = Math.floor(c)
      let e = Infinitize(c - d)
      let f = Math.floor(e)
      let g = Infinitize(e - f)
      let h = Math.floor(g)
      let i = Infinitize(g - h)
      let j = Math.floor(i)
      let l = Infinitize(i - j)
      let m = Math.floor(l)
      return `ω<sup>${b}</sup>${d == 1 ? "" : d}` + 
        (f == 0 ? "" : `+ω<sup>${b == 2 ? "" : b - 1}</sup>${f == 1 ? "" : f}`) +
        (h == 0 ? "" : "+" + (b == 2? "" : `ω<sup>${b == 3 ? "" : b - 2}</sup>`) +`${(h == 1 && b > 2) ? "" : h}`) + 
        ((j == 0 || b == 2) ? "" : "+" + (b == 3? "" : `ω<sup>${b == 4 ? "" : b - 3}</sup>`) +`${(j == 1 && b > 3) ? "" : j}`) +
        ((m == 0 || b <= 3) ? "" : "+" + (b == 4? "" : `ω<sup>${b == 5 ? "" : b - 4}</sup>`) +`${(m == 1 && b > 4) ? "" : m}`)
    } else if (x < 75000) {
      let a = LogInfinitize((x - 30000) / 90000 + 0.5, 1.75)
      let b = Math.floor(a)
      let c = (a - b) * 27000 + 3000
      return "ω<sup>".repeat(b)+ordinal(c)+"</sup>".repeat(b)
    } else if (x < 100000) {
      let a = Infinitize((x - 75000) / 25000)
      let b = Math.floor(a)
      let c = `ψ(${b})`
      let d = LogInfinitize(a - b, 1.75) + 1
      let e = Math.floor(d)
      let f = (d - e) * (InversedInfinitize(b + InversedLogInfinitized(e)) * 25000 + 75000 - 1500) + 1500
      let g = ordinal(f)
      let h = Infinitize(d - e) + 1
      let i = Math.floor(h)
      if (g == "1") g = ""
      e = Math.min(e, 35)
      return `${c}<sup>`.repeat(e) + g + `</sup>`.repeat(e)
    } else if (x < 125000) {
      let a = Infinitize((x - 100000) / 50000 + 0.5)
      let b = Math.floor(a)
      let c = (a - b) * 97000 + 3000
      let d = String(b)
      if (b == 1) d = ""
      return `ψ<sup>${d}</sup>(${ordinal(c)})`
    } else {
      return "ψ(Ω)"
    }
  }
</script>

{@html ordinal(t)}<br>
<!--{t}!-->