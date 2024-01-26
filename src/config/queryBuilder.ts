
export function normalQuery(term: string) {
	return {
		index: 'e-index-pdf3',
		q: term,
		highlight: {
			fields: {
				"content": {
					"pre_tags": ["<b>"],
					"post_tags": ["</b>"]
				}
			}
		}, _source_excludes: ["content"]
	}
}

export function phraseQuery(term: string | undefined) {
	return {
		query: {
			match_phrase: {
				content: term
			},
		}, highlight: {
			fields: {
				"content": {
					"pre_tags": ["<b>"],
					"post_tags": ["</b>"]
				}
			}
		}, _source_excludes: ["content"]
	}
}