const NGN_FORMATTER = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
})

function formatNgn(amount: number) {
  return NGN_FORMATTER.format(amount)
}

export { formatNgn }
