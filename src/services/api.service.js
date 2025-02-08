import { post } from '@/http/api';

class CacheManager {
  constructor() {
    this.cache = new Map();
  }

  isTokenValid() {
    const token = localStorage.getItem('Authorization');
    return !!token; // 如果token存在返回true,否则返回false
  }

  get(key) {
    // 先验证token是否存在
    if (!this.isTokenValid()) {
      this.clear(); // token不存在时清空所有缓存
      return null;
    }
    
    return this.cache.get(key)?.data || null;
  }

  set(key, data) {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  clear() {
    this.cache.clear();
  }
}

const cacheManager = new CacheManager();

export default {
  /**
   * 获取产品类别(带缓存)
   * @returns {Promise} 返回产品类别数据
   */
  async getProdClass() {
    const cacheKey = 'ProdClass';
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) return cachedData;

    const postData = {
      docType: "ProdClass",
      parameters: {}
    };
    const result = await post("/forward", postData);
    if (result.state === "OK") {
      cacheManager.set(cacheKey, result);
    }
    return result;
  },

  /**
   * 获取客户代码列表(带缓存)
   * @returns {Promise} 返回客户代码列表数据
   */
  async getCustomerList() {
    const cacheKey = 'CustomerList';
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) return cachedData;

    const postData = {
      docType: "CustomerList",
      parameters: {}
    };
    const result = await post("/forward", postData);
    if (result.state === "OK") {
      cacheManager.set(cacheKey, result);
    }
    return result;
  },

  /**
   * 获取课级单位列表(带缓存)
   * @returns {Promise} 返回课级单位列表数据
   */
  async getSuperOrgList() {
    const cacheKey = 'SuperOrgList';
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) return cachedData;

    const postData = {
      docType: "PassSuperOrgList",
      parameters: {}
    };
    const result = await post("/forward", postData);
    if (result.state === "OK") {
      cacheManager.set(cacheKey, result);
    }
    return result;
  },

  /**
   * 获取组级单位列表(带缓存)
   * @param {string} superOrgId 课级单位ID
   * @returns {Promise} 返回组级单位列表数据
   */
  async getOrgList(superOrgId) {
    const cacheKey = `OrgList_${superOrgId}`;
    const cachedData = cacheManager.get(cacheKey);
    if (cachedData) return cachedData;

    const postData = {
      docType: "PassOrgList",
      parameters: {
        SuperOrgId: superOrgId
      }
    };
    const result = await post("/forward", postData);
    if (result.state === "OK") {
      cacheManager.set(cacheKey, result);
    }
    return result;
  },

  // 清除所有缓存
  clearCache() {
    cacheManager.clear();
  }
};
