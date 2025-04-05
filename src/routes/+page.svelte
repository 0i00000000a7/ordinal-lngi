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
				t = Math.min(t + 1, 180000);
				localStorage.ordinal_lngi_rewritten = t;
			}, 16.666666666666666666);
			// }, 0);
		}
	});

	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
	});

	function Infinitize(n: number) {
		return 1 / (1 - n) - 1;
	}

	function InversedInfinitize(n: number) {
		return 1 - 1 / (n + 1);
	}

	function LogInfinitize(n: number, base = 2) {
		return -Math.log(1 - n) / Math.log(base);
	}

	function InversedLogInfinitize(n: number, base = 2) {
		return 1 - base ** -n;
	}

	function roundFloat(x: number, precision: number = 14): number {
		return Number(x.toFixed(precision));
	}

	function ordinal(x: number): string {
		if (x < 3000) {
			return String(Math.floor(Infinitize(x / 3000)));
		} else if (x < 10000) {
			let a = Infinitize((x - 3000) / 14000 + 0.5);
			let b = Math.floor(a);
			let c = Math.floor(Infinitize(a - b));
			return 'ω' + (b == 1 ? '' : b) + (c == 0 ? '' : '+' + c);
		} else if (x < 30000) {
			let a = roundFloat(Infinitize((x - 10000) / 60000 + 2 / 3), 14);
			let b = Math.floor(a);
			let c = Infinitize((a - b) / 2 + 0.5);
			let d = Math.floor(c);
			let e = Infinitize(c - d);
			let f = Math.floor(e);
			let g = Infinitize(e - f);
			let h = Math.floor(g);
			let i = Infinitize(g - h);
			let j = Math.floor(i);
			let l = Infinitize(i - j);
			let m = Math.floor(l);
			return (
				`ω<sup>${b}</sup>${d == 1 ? '' : d}` +
				(f == 0 ? '' : `+ω<sup>${b == 2 ? '' : b - 1}</sup>${f == 1 ? '' : f}`) +
				(h == 0
					? ''
					: '+' +
						(b == 2 ? '' : `ω<sup>${b == 3 ? '' : b - 2}</sup>`) +
						`${h == 1 && b > 2 ? '' : h}`) +
				(j == 0 || b == 2
					? ''
					: '+' +
						(b == 3 ? '' : `ω<sup>${b == 4 ? '' : b - 3}</sup>`) +
						`${j == 1 && b > 3 ? '' : j}`) +
				(m == 0 || b <= 3
					? ''
					: '+' +
						(b == 4 ? '' : `ω<sup>${b == 5 ? '' : b - 4}</sup>`) +
						`${m == 1 && b > 4 ? '' : m}`)
			);
		} else if (x < 75000) {
			let a = LogInfinitize((x - 30000) / 45000, 1.75) + 1;
			let b = Math.floor(a);
			let c = (a - b) * 27000 + 3000;
			return 'ω<sup>'.repeat(b) + ordinal(c) + '</sup>'.repeat(b);
		} else if (x < 100000) {
			let a = Infinitize((x - 75000) / 25000);
			let b = Math.floor(a);
			let c = `ψ(${b})`;
			let d = LogInfinitize(a - b, 1.75) + 1;
			let e = Math.floor(d);
			let f =
				(d - e) * (InversedInfinitize(b + InversedLogInfinitize(e, 1.75)) * 25000 + 75000 - 1500) +
				1500;
			let g = ordinal(f);
			let h = Infinitize(d - e) + 1;
			let i = Math.floor(h);
			if (g == '1') g = '';
			e = Math.min(e, 35);
			return `${c}<sup>`.repeat(e) + g + `</sup>`.repeat(e);
		} else if (x < 125000) {
			let a = Infinitize((x - 100000) / 50000 + 0.5);
			let b = Math.floor(a);
			let c = (a - b) * 97000 + 3000;
			let d = String(b);
			if (b == 1) d = '';
			return `ψ<sup>${d}</sup>(${ordinal(c)})`;
		} else if (x < 155000) {
			let a = Infinitize((x - 125000) / 30000) + 1;
			let b = Math.floor(a);
			let c = Infinitize(a - b) + 1;
			let d = Math.floor(c);
			let e = ordinal(
				(InversedInfinitize(b + InversedLogInfinitize(d) - 1) * 30000 + 125000) * (c - d)
			);
			let f = `ψ(Ω${b == 1 ? '' : b}`;
			if (d > 5) return `${f}+${f}+...${e}...))(${d} repeats)`;
			return `${f}+`.repeat(d - 1) + f + (e == '0' ? '' : '+' + e) + ')'.repeat(d);
		} else if (x < 180000) {
			let a = Infinitize((x - 155000) / 50000 + 0.5);
			let b = Math.floor(a);
			let c = (a - b) * 152000 + 3000;
			if (b > 5) return `ψ(Ωψ(Ω...${ordinal(c)}...))(${b} repeats)`;
			return 'ψ(Ω'.repeat(b) + ordinal(c) + ')'.repeat(b);
		} else {
			return 'ψ(Ω<sup>2</sup>)';
		}
	}

	function getTier(n: number): number {
		const thresholds = [3000, 10000, 30000, 75000, 100000, 125000, 155000, 180000, Infinity];
		for (let i = 0; i < thresholds.length; i++) {
			if (t < thresholds[i]) {
				return n + 1;
			}
		}
	}

	function formatTime(t: number): string {
		const totalSeconds = Math.floor(t / 60);
		const days = Math.floor(totalSeconds / (24 * 60 * 60));
		const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
		const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
		const seconds = (totalSeconds % 60).toFixed(0);

		let formattedTime = '';

		if (days > 0) {
			formattedTime += days + '天 ';
		}

		if (hours > 0) {
			formattedTime += hours + '小时 ';
		}

		if (minutes > 0) {
			formattedTime += minutes + '分钟 ';
		}

		formattedTime += seconds + '秒';

		return formattedTime;
	}
</script>

<div class="tier{getTier(t)}">{@html ordinal(t)}</div>
当前游戏时间: {formatTime(t)}<br />
{#if import.meta.env.MODE == 'development'}
	{t}<br />
	<input bind:value={t} />
{/if}

<svelte:head>
	<style>
		body {
			margin: 32px;
			background: black;
			font-size: 25px;
			user-select: none;
			color: white;
			font-family: Bahnschrift, sans-serif;
		}

		@font-face {
			font-family: 'Bahnschrift';
			src: url('bahnschrift.ttf');
			size-adjust: 100%;
		}

		.tier1 {
			color: white;
		}

		.tier2 {
			color: #a15c2f;
		}

		.tier3 {
			color: #a8a8a8;
		}

		.tier4 {
			color: #e5c100;
		}

		@supports (-webkit-background-clip: text) and (-webkit-text-fill-color: transparent) {
			.tier5 {
				background: linear-gradient(135deg, #79b9c7, #69d2ea);
				-webkit-text-fill-color: transparent;
				-webkit-background-clip: text;
			}

			.tier6 {
				background: radial-gradient(#6666ff, #5252d1, #3636e0);
				-webkit-text-fill-color: transparent;
				-webkit-background-clip: text;
			}

			.tier7 {
				background: repeating-linear-gradient(#ed333b, #ff343e 20px, #ed333b 20px, #ff343e 25px);
				-webkit-text-fill-color: transparent;
				-webkit-background-clip: text;
			}

			.tier8 {
				background: repeating-conic-gradient(white 0%, #dedede 15%, white 33%);
				-webkit-text-fill-color: transparent;
				-webkit-background-clip: text;
			}

			.tier9 {
				background: linear-gradient(
					45deg,
					#e9ba0f 25%,
					#ffc800 0,
					#ffc800 50%,
					#e9ba0f 0,
					#e9ba0f 75%,
					#ffc800 0
				);
				-webkit-text-fill-color: transparent;
				-webkit-background-clip: text;
			}
		}
	</style>
</svelte:head>
