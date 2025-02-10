import { NextResponse } from 'next/server'

// Simplified interface with only the fields we care about
interface FDAResponse {
  meta: {
    results: {
      total: number;
    }
  };
  results: FDAResult[];
}

// Only include the fields you want to use
interface FDAResult {
  product_description: string;
  recall_initiation_date: string;
  product_quantity: string;
  reason_for_recall: string;
  status: string;
  recalling_firm: string;
  classification: string;
  distribution_pattern: string;
}

export async function GET(request: Request) {
  const fda_key = process.env.NEXT_PUBLIC_fda_key
  if (!fda_key) {
    console.error('Error: FDA API key is missing. Ensure NEXT_PUBLIC_fda_key is set.')
  } else {
    console.log('FDA key is available and being used.')
  }

  // production should be NEXT_PUBLIC_fda_key
  const { searchParams } = new URL(request.url)
  
  const productName = searchParams.get('product') || ''
  const quantity = searchParams.get('quantity') || ''

  const search_params = [
    `product_description:"${productName}"`,
    `product_type:"Food"`,
    `status:"Ongoing"`,
  ].join('+AND+')

  const limit = 10
  
  const url = `https://api.fda.gov/food/enforcement.json?api_key=${fda_key}&search=${search_params}&limit=${limit}`
  console.log(fda_key)
  try {
    const response = await fetch(url)
    const data: FDAResponse = await response.json()
    return parseData(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch FDA data internally' }, { status: 500 })
  }
}

function parseData(response: FDAResponse) {
  const filteredResults = response.results.map(item => ({
    description: item.product_description,
    date: transformDate(item.recall_initiation_date),
    quantity: item.product_quantity,
    reason: item.reason_for_recall,
    status: item.status,
    firm: item.recalling_firm,
    classification: transformClassification(item.classification),
    distribution: item.distribution_pattern
    
  }));

  return NextResponse.json({
    total: response.meta.results.total,
    results: filteredResults
  });
}

function transformDate(date: string) {
  // the date is formatted as yyyymmdd
  const year = '20' + date.slice(2, 4)
  const month = date.slice(4, 6)
  const day = date.slice(6, 8)
  return `${month}/${day}/${year}`
}

function transformClassification(classification: string) {
  switch (classification) {
    case 'Class I':
      return 'Class I: The most serious type of recall, issued when a product poses a significant risk of causing serious injury or death if consumed. Immediate action is required to prevent harm.'
    case 'Class II':
      return 'Class II: A recall for products that may cause temporary or reversible health issues, but the risk of severe injury or death is low. These recalls still address potentially harmful situations.'
    case 'Class III':
      return 'Class III: The least serious recall, involving products that are unlikely to cause health problems but are still removed from the market as a precautionary measure.'
    default:
      return 'Unknown classification'
  }
}
