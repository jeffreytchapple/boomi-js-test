export function mapDocument(doc) {
  const order = doc.Order || {};

  const mapped = {
    orderId: order.Id || null,
    accountId: order.AccountId || null,
    status: order.Status || null,
    effectiveDate: order.EffectiveDate || null,
    billing: {
      street: order.BillingStreet || null,
      city: order.BillingCity || null,
      state: order.BillingState || null,
      postalCode: order.BillingPostalCode || null,
      country: order.BillingCountry || null
    }
  };

  mapped.isActive =
    mapped.status &&
    mapped.status.toLowerCase() === "activated";

  return mapped;
}
