/*
 *
 * Koco Widgets 会员解锁脚本
 * 基于 RevenueCat 订阅系统
 *
 * 使用声明：此脚本仅供学习与交流，请在下载使用24小时内删除！请勿在中国大陆转载与贩卖！
 *
 ====================================
 [rewrite_local]
 # Koco Widgets 会员解锁 - subscribers API
 ^https://api\.revenuecat\.com/v1/subscribers/.* url script-response-body https://raw.githubusercontent.com/577985548/quanx-scripts/main/koco_unlock.js
 # Koco Widgets 会员解锁 - receipts API
 ^https://api\.revenuecat\.com/v1/receipts url script-response-body https://raw.githubusercontent.com/577985548/quanx-scripts/main/koco_unlock.js

 [mitm]
 hostname = api.revenuecat.com
 ====================================
 *
 */

let body = $response.body;
let url = $request.url;

try {
  let obj = JSON.parse(body);

  // 会员数据模板
  const vipData = {
    "expires_date": "2099-12-31T23:59:59Z",
    "original_purchase_date": "2026-01-01T00:00:00Z",
    "purchase_date": "2026-01-01T00:00:00Z",
    "store": "app_store",
    "is_sandbox": false,
    "ownership_type": "PURCHASED",
    "period_type": "normal"
  };

  // 处理 subscribers API
  if (url.includes("/subscribers/") && obj.subscriber) {
    obj.subscriber.entitlements = {
      "premium": vipData,
      "pro": vipData,
      "plus": vipData
    };

    obj.subscriber.subscriptions = {
      "com.niko.pocketwidgets.premium": {
        ...vipData,
        "unsubscribe_detected_at": null,
        "billing_issues_detected_at": null,
        "store_transaction_id": "999999999999999",
        "auto_resume_date": null
      },
      "com.niko.pocketwidgets.pro": {
        ...vipData,
        "unsubscribe_detected_at": null,
        "billing_issues_detected_at": null,
        "store_transaction_id": "999999999999999",
        "auto_resume_date": null
      }
    };

    console.log("✅ Koco subscribers 解锁成功");
  }

  // 处理 receipts API
  if (url.includes("/receipts") && obj.subscriber) {
    obj.subscriber.entitlements = {
      "premium": vipData,
      "pro": vipData,
      "plus": vipData
    };

    obj.subscriber.subscriptions = {
      "com.niko.pocketwidgets.premium": {
        ...vipData,
        "unsubscribe_detected_at": null,
        "billing_issues_detected_at": null
      }
    };

    console.log("✅ Koco receipts 解锁成功");
  }

  $done({ body: JSON.stringify(obj) });

} catch (e) {
  console.log("❌ 错误：" + e);
  $done({ body });
}
