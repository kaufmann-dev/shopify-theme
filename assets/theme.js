class VariantSelector extends HTMLElement {
  connectedCallback() {
    this.form = document.getElementById(this.dataset.form);
    this.variantInput = this.form?.querySelector('[name="id"]');
    this.addButton = this.form?.querySelector('[name="add"]');
    this.price = document.getElementById(this.dataset.price);
    this.variants = JSON.parse(this.querySelector('[type="application/json"]').textContent);
    this.addEventListener('change', () => this.updateVariant());
  }

  updateVariant() {
    const options = Array.from(this.querySelectorAll('select'), (select) => select.value);
    const variant = this.variants.find((candidate) =>
      candidate.options.every((option, index) => option === options[index])
    );

    if (!variant) {
      this.variantInput.value = '';
      this.addButton.disabled = true;
      this.addButton.textContent = this.addButton.dataset.unavailable;
      return;
    }

    this.variantInput.value = variant.id;
    this.addButton.disabled = !variant.available;
    this.addButton.textContent = variant.available
      ? this.addButton.dataset.available
      : this.addButton.dataset.soldOut;

    if (this.price && variant.formatted_price) {
      this.price.textContent = variant.formatted_price;
    }

    const url = new URL(window.location.href);
    url.searchParams.set('variant', variant.id);
    window.history.replaceState({}, '', url);
  }
}

if (!customElements.get('variant-selector')) {
  customElements.define('variant-selector', VariantSelector);
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-sort-by]').forEach((select) => {
    select.addEventListener('change', () => select.form.requestSubmit());
  });

  document.querySelectorAll('[data-menu-close]').forEach((link) => {
    link.addEventListener('click', () => link.closest('details')?.removeAttribute('open'));
  });
});
