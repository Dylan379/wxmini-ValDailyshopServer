module.exports = {
    /**
       * 判断是否有相同元素
       * @param {Array} myBellring
        * @param {Array} dailyWeaponUuid
       * @return: 
       */
    hasSame: async (myBellring, dailyWeaponUuid) => {
        // 合并数组
        const normalArr = [...myBellring, ...dailyWeaponUuid]
        // 合并数组并去重
        const setArr = [...new Set(normalArr)]
        return normalArr.length !== setArr.length
    },
    /**
      * 判断是否有相同元素
      * @param {Array} myBellring
       * @param {Array} dailyWeaponUuid
      * @return: 
      */
    sameItems: async (myBellring, dailyWeaponUuid) => {
        return myBellring.filter(item => {
            if (dailyWeaponUuid.indexOf(item) > -1) {
                return item;
            }
        })
    },
}