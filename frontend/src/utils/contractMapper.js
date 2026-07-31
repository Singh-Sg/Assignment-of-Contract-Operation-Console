

export function formValuesToPayload(values) {
  return {
    client_name: values.clientName,
    po_ref_no: values.poRefNo,
    po_date: values.poDate,
    payment_terms: values.paymentTerms,
    delivery_terms: values.deliveryTerms,
    items: values.items.map((item) => ({
      description: item.description,
      quantity: Number(item.quantity),
      quantity_unit: item.quantityUnit,
      unit_price: Number(item.unitPrice),
      pricing_unit: item.pricingUnit,
    })),
  };
}

export function contractToFormValues(contract) {
  if (!contract) return null;

  return {
    clientName: contract.field_data?.client_name || "",
    poRefNo: contract.field_data?.po_ref_no || "",
    poDate: (contract.field_data?.po_date || "").slice(0, 10),
    paymentTerms: contract.field_data?.payment_terms || "",
    deliveryTerms: contract.field_data?.delivery_terms || "",

    items:
      contract.field_data?.items?.map((item) => ({
        description: item.description || "",
        quantity: item.quantity ?? "",
        quantityUnit: item.quantity_unit || "",
        unitPrice: item.unit_price ?? "",
        pricingUnit: item.pricing_unit || "",
        total: item.total ?? "",
      })) || [],
  };
}
