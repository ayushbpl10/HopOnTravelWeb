/**
 * Security Throttler & Attack Protection System
 * Enforces rate limiting on sensitive mutations and triggers an escalating lockout
 * if rapid bursts / attack patterns are detected.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.SecurityThrottler = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var MEMORY_STORE = {
    history: [],
    lockoutUntil: 0
  };

  var STORAGE_KEY = '_hopon_sec_throttle';

  function getStorage() {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return window.localStorage;
      }
    } catch (e) {}
    return null;
  }

  function loadState() {
    var storage = getStorage();
    if (!storage) return MEMORY_STORE;
    try {
      var raw = storage.getItem(STORAGE_KEY);
      if (raw) {
        var parsed = JSON.parse(raw);
        return {
          history: Array.isArray(parsed.history) ? parsed.history : [],
          lockoutUntil: Number(parsed.lockoutUntil) || 0
        };
      }
    } catch (e) {}
    return { history: [], lockoutUntil: 0 };
  }

  function saveState(state) {
    var storage = getStorage();
    MEMORY_STORE = state;
    if (!storage) return;
    try {
      storage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {}
  }

  var SecurityThrottler = {
    DEFAULT_CONFIG: {
      maxBurst: 5,         // Max 5 sensitive operations
      windowMs: 15000,     // Within 15 seconds
      lockoutMs: 60000     // 60-second penalty lockout
    },

    /**
     * Checks if current session is locked out due to attack detection.
     */
    isLockedOut: function () {
      var state = loadState();
      return Date.now() < state.lockoutUntil;
    },

    /**
     * Returns remaining lockout seconds (0 if not locked out).
     */
    getRemainingLockoutSeconds: function () {
      var state = loadState();
      var now = Date.now();
      if (now >= state.lockoutUntil) return 0;
      return Math.ceil((state.lockoutUntil - now) / 1000);
    },

    /**
     * Resets state (useful for tests).
     */
    reset: function () {
      saveState({ history: [], lockoutUntil: 0 });
    },

    /**
     * Enforces throttling on an action.
     * Returns true if allowed, or false if blocked.
     * @param {string} actionName - Human-readable action name
     * @param {Object} [customConfig] - Optional override config
     * @returns {boolean} allowed
     */
    checkAndEnforce: function (actionName, customConfig) {
      var config = Object.assign({}, this.DEFAULT_CONFIG, customConfig || {});
      var now = Date.now();
      var state = loadState();

      // 1. Check if already in active lockout
      if (now < state.lockoutUntil) {
        var remaining = Math.ceil((state.lockoutUntil - now) / 1000);
        var lockoutMsg = '🚨 Security Alert: Attack Protection Active\n\n' +
          'Multiple rapid requests were detected. This action (' + (actionName || 'operation') + ') has been blocked.\n' +
          'Please wait ' + remaining + ' seconds before trying again.';
        
        if (typeof alert === 'function') {
          alert(lockoutMsg);
        } else {
          console.warn(lockoutMsg);
        }
        return false;
      }

      // 2. Prune timestamps outside the sliding window
      var recent = state.history.filter(function (ts) {
        return now - ts < config.windowMs;
      });

      // 3. Check burst threshold
      if (recent.length >= config.maxBurst) {
        // Trigger attack lockout
        state.lockoutUntil = now + config.lockoutMs;
        state.history = recent;
        saveState(state);

        var penaltySec = Math.ceil(config.lockoutMs / 1000);
        var attackMsg = '🚨 Attack Protection Activated!\n\n' +
          'Too many rapid requests were detected within a short period.\n' +
          'Your session has been temporarily locked for ' + penaltySec + ' seconds to safeguard system integrity.';

        if (typeof alert === 'function') {
          alert(attackMsg);
        } else {
          console.warn(attackMsg);
        }

        if (typeof window !== 'undefined' && typeof window.dispatchEvent === 'function') {
          try {
            window.dispatchEvent(new CustomEvent('hopon-attack-blocked', {
              detail: { actionName: actionName, lockoutSeconds: penaltySec }
            }));
          } catch (e) {}
        }

        return false;
      }

      // 4. Operation allowed, record timestamp
      recent.push(now);
      state.history = recent;
      saveState(state);
      return true;
    }
  };

  return SecurityThrottler;
});
