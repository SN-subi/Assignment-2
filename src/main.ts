import '../style.css'

const resultTable = document.getElementById('results') as HTMLDivElement
const valueA = document.getElementById('a') as HTMLInputElement
const valueB = document.getElementById('b') as HTMLInputElement
const valueC = document.getElementById('c') as HTMLInputElement
const valueD = document.getElementById('d') as HTMLInputElement
const formula = document.getElementById('formula') as HTMLElement
const canvas = document.getElementById('graph') as HTMLCanvasElement
const ctx = canvas.getContext('2d')!
const button = document.querySelector('button') as HTMLButtonElement

button.addEventListener('click', (e) => {
  e.preventDefault()

  const a = parseFloat(valueA.value)
  const b = parseFloat(valueB.value)
  const c = parseFloat(valueC.value)
  const d = parseFloat(valueD.value)

  const result = solveCubic(a, b, c, d)

  formula.innerText = `${a}x³ + ${b}x² + ${c}x + ${d} = 0`

  resultTable.innerHTML = `
    <table>
      <tr><td>p</td><td>${result.p.toFixed(5)}</td></tr>
      <tr><td>q</td><td>${result.q.toFixed(5)}</td></tr>
      <tr><td>Discriminant</td><td>${result.discriminant.toFixed(5)}</td></tr>
      <tr><td>Root 1</td><td>${result.roots[0]}</td></tr>
      <tr><td>Root 2</td><td>${result.roots[1]}</td></tr>
      <tr><td>Root 3</td><td>${result.roots[2]}</td></tr>
    </table>
  `

  drawGraph(a, b, c, d, result.roots)
})

function solveCubic(a: number, b: number, c: number, d: number) {
  const p = (3 * a * c - b ** 2) / (3 * a ** 2)
  const q = (2 * b ** 3 - 9 * a * b * c + 27 * a ** 2 * d) / (27 * a ** 3)
  const discriminant = (q / 2) ** 2 + (p / 3) ** 3

  let roots: (number | string)[] = []

  if (discriminant < 0) {
    const k = 2 * Math.sqrt(-p / 3)
    const theta = (1 / 3) * Math.acos(-q / (2 * (Math.sqrt(-p / 3)) ** 3))
    roots.push(k * Math.cos(theta) - b / (3 * a))
    roots.push(k * Math.cos(theta + 2 * Math.PI / 3) - b / (3 * a))
    roots.push(k * Math.cos(theta + 4 * Math.PI / 3) - b / (3 * a))
  } else if (discriminant === 0) {
    const x1 = Math.cbrt(-q / 2) * 2 - b / (3 * a)
    const x2 = -Math.cbrt(-q / 2) - b / (3 * a)
    roots = [x1, x2, x2]
  } else {
    const x = Math.cbrt(-q / 2 + Math.sqrt(discriminant)) + Math.cbrt(-q / 2 - Math.sqrt(discriminant)) - b / (3 * a)
    roots = [x, "Complex Number", "Complex Number"]
  }

  return { p, q, discriminant, roots }
}

function drawGraph(a: number, b: number, c: number, d: number, roots: (number | string)[]) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  const w = canvas.width
  const h = canvas.height
  const scale = 40
  const cx = w / 2
  const cy = h / 2

  // Draw grid
  ctx.strokeStyle = '#131111'
  ctx.lineWidth = 1
  for (let i = 0; i < w; i += scale) { ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, h); ctx.stroke() }
  for (let i = 0; i < h; i += scale) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(w, i); ctx.stroke() }

  // Draw axes
  ctx.strokeStyle = '#000'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(cx, 0); ctx.lineTo(cx, h)
  ctx.moveTo(0, cy); ctx.lineTo(w, cy)
  ctx.stroke()

  // Draw cubic curve
  ctx.strokeStyle = '#7f0000'
  ctx.lineWidth = 2
  ctx.beginPath()
  for (let px = 0; px < w; px++) {
    const x = (px - cx) / scale
    const y = a * x ** 3 + b * x ** 2 + c * x + d
    const py = cy - y * scale
    if (px === 0) ctx.moveTo(px, py)
    else ctx.lineTo(px, py)
  }
  ctx.stroke()

  // Mark real roots
  roots.forEach(root => {
    if (typeof root === 'number') {
      const px = cx + root * scale
      const py = cy
      ctx.beginPath()
      ctx.arc(px, py, 5, 0, Math.PI * 2)
      ctx.fillStyle = '#00fa1d'
      ctx.fill()
      ctx.strokeStyle = '#000'
      ctx.lineWidth = 1
      ctx.stroke()
    }
  })
}