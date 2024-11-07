import React from 'react'
import styles from './stackloader.module.css'

function SearchStackLoader() {
  return (
    <div className="container mt-4">
        <div className="row px-1 py-0">
            
            <div className={`${styles.skeleton} ${styles.skeletonText} mt-0 py-0 mb-3`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText} mb-3`}></div>
           
        </div>
    </div>
  )
}

export default SearchStackLoader