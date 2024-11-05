import React from 'react'
import styles from './stackloader.module.css'

function StackLoader() {
  return (
    <div className="container mt-4">
        <div className="row px-1">
            
            <div className={`${styles.skeleton} ${styles.skeletonText} mb-3`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText} mb-3`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText} mb-3`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText} mb-3`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText} mb-3`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText} mb-3`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText} mb-3`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText} mb-3`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText} mb-3`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText} mb-3`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText} mb-3`}></div>
            <div className={`${styles.skeleton} ${styles.skeletonText} mb-3`}></div>

        </div>
    </div>
  )
}

export default StackLoader