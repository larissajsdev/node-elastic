import {Client} from "@elastic/elasticsearch"
export const client = new Client({
  node: 'https://1e9d234d3b784d15b8ed5dace2be147a.us-central1.gcp.cloud.es.io', // Elasticsearch endpoint
  auth: {
    username: 'elastic',
    password: 'KT2oBG59Kdcl0Xk9cB09GCbe',
  },
})
 

