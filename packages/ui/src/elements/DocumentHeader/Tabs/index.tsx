import React from 'react'

import { DocumentTab } from './Tab'
import { getCustomViews } from './getCustomViews'
import { getViewConfig } from './getViewConfig'
import { tabs as defaultViews } from './tabs'

import './index.scss'
import { DocumentTabProps } from 'payload/types'

const baseClass = 'doc-tabs'

export const DocumentTabs: React.FC<DocumentTabProps> = (props) => {
  const { collectionConfig, globalConfig, isEditing } = props

  const customViews = getCustomViews({ collectionConfig, globalConfig })

  // Don't show tabs when creating new documents
  if ((collectionConfig && isEditing) || global) {
    return (
      <div className={baseClass}>
        <div className={`${baseClass}__tabs-container`}>
          <ul className={`${baseClass}__tabs`}>
            {Object.entries(defaultViews)
              // sort `defaultViews` based on `order` property from smallest to largest
              // if no `order`, append the view to the end
              // TODO: open `order` to the config and merge `defaultViews` with `customViews`
              ?.sort(([, a], [, b]) => {
                if (a.order === undefined && b.order === undefined) return 0
                else if (a.order === undefined) return 1
                else if (b.order === undefined) return -1
                return a.order - b.order
              })
              ?.map(([name, Tab], index) => {
                const viewConfig = getViewConfig({ name, collectionConfig, globalConfig })
                const tabOverrides = viewConfig && 'Tab' in viewConfig ? viewConfig.Tab : undefined

                return (
                  <DocumentTab
                    {...{
                      ...props,
                      ...(Tab || {}),
                      ...(tabOverrides || {}),
                    }}
                    key={`tab-${index}`}
                  />
                )
              })}
            {customViews?.map((CustomView, index) => {
              if ('Tab' in CustomView) {
                const { Tab, path } = CustomView

                if (typeof Tab === 'function') {
                  return <Tab path={path} {...props} key={`tab-custom-${index}`} />
                }

                return (
                  <DocumentTab
                    {...{
                      ...props,
                      ...Tab,
                    }}
                    key={`tab-custom-${index}`}
                  />
                )
              }
              return null
            })}
          </ul>
        </div>
      </div>
    )
  }

  return null
}