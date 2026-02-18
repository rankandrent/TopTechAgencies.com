import React from 'react'

interface SemanticSchemaProps {
    type: 'LocalBusiness' | 'Article' | 'ItemList' | 'BreadcrumbList' | 'Organization' | 'WebSite' | 'FAQPage'
    data: any
}

export function SemanticSchema({ type, data }: SemanticSchemaProps) {
    let schemaData: any = {}

    if (type === 'LocalBusiness') {
        schemaData = {
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: data.name,
            description: data.description,
            url: data.url,
            // connect to clutch/linkedin if available
            sameAs: data.sameAs || [],
            aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: data.rating,
                reviewCount: data.reviews || 1
            },
            address: {
                '@type': 'PostalAddress',
                addressLocality: data.city,
                addressRegion: data.state
            },
            priceRange: data.priceRange || '$$$'
        }
    }

    if (type === 'ItemList') {
        schemaData = {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: data.title,
            description: data.description,
            itemListElement: data.items.map((item: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                item: {
                    '@type': 'LocalBusiness',
                    name: item.name,
                    url: item.url,
                    image: item.image,
                    aggregateRating: item.rating ? {
                        '@type': 'AggregateRating',
                        ratingValue: item.rating,
                        reviewCount: item.reviews || 1
                    } : undefined,
                    address: item.city ? {
                        '@type': 'PostalAddress',
                        addressLocality: item.city,
                        addressRegion: item.state
                    } : undefined
                }
            }))
        }
    }

    if (type === 'BreadcrumbList') {
        schemaData = {
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: data.map((crumb: any, index: number) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: crumb.name,
                item: crumb.url ? `https://toptechagencies.com${crumb.url}` : undefined
            }))
        }
    }

    if (type === 'Organization') {
        schemaData = {
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: data.name,
            url: data.url,
            logo: data.logo,
            sameAs: data.sameAs,
            contactPoint: data.contactPoint
        }
    }

    if (type === 'WebSite') {
        schemaData = {
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            name: data.name,
            url: data.url,
            potentialAction: {
                '@type': 'SearchAction',
                target: {
                    '@type': 'EntryPoint',
                    urlTemplate: `${data.url}/services?q={search_term_string}`
                },
                'query-input': 'required name=search_term_string'
            }
        }
    }

    if (type === 'FAQPage') {
        schemaData = {
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: data.map((faq: any) => ({
                '@type': 'Question',
                name: faq.question,
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: faq.answer
                }
            }))
        }
    }

    // Article schema (already partially implemented in logical flow, ensuring full support)
    if (type === 'Article') {
        schemaData = {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: data.headline,
            image: data.image,
            datePublished: data.datePublished,
            dateModified: data.dateModified,
            author: [{
                '@type': 'Person',
                name: data.authorName || 'Eleken Editorial Team',
                url: data.authorUrl
            }],
            publisher: {
                '@type': 'Organization',
                name: 'TopTechAgencies.com',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://toptechagencies.com/logo.png'
                }
            }
        }
    }

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
        />
    )
}
