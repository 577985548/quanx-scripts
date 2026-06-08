/*
 *
 * Koco Widgets 会员解锁脚本
 * 基于 RevenueCat 订阅系统
 *
 * 使用声明：此脚本仅供学习与交流，请在下载使用24小时内删除！请勿在中国大陆转载与贩卖！
 *
 ====================================
 [rewrite_local]
 # Koco Widgets 会员解锁
 ^https://api\.revenuecat\.com/v1/subscribers/.* url script-response-body https://raw.githubusercontent.com/577985548/quanx-scripts/main/koco_unlock.js

 [mitm]
 hostname = api.revenuecat.com
 ====================================
 *
 */

let body = $response.body;

try {
  let obj = JSON.parse(body);

  if (obj.subscriber) {
    // 填充会员权益
    obj.subscriber.entitlements = {
      "premium": {
        "expires_date": "2099-12-31T23:59:59Z",
        "product_identifier": "com.niko.pocketwidgets.premium",
        "purchase_date": "2026-01-01T00:00:00Z",
        "original_purchase_date": "2026-01-01T00:00:00Z",
        "store": "app_store",
        "is_sandbox": false,
        "ownership_type": "PURCHASED",
        "period_type": "normal"
      }
    };

    // 填充订阅信息
    obj.subscriber.subscriptions = {
      "com.niko.pocketwidgets.premium": {
        "expires_date": "2099-12-31T23:59:59Z",
        "original_purchase_date": "2026-01-01T00:00:00Z",
        "purchase_date": "2026-01-01T00:00:00Z",
        "period_type": "normal",
        "store": "app_store",
        "is_sandbox": false,
        "unsubscribe_detected_at": null,
        "billing_issues_detected_at": null,
        "ownership_type": "PURCHASED"
      }
    };

    console.log("✅ Koco 会员解锁成功");
  }

  $done({ body: JSON.stringify(obj) });

} catch (e) {
  console.log("❌ 错误：" + e);
  $done({ body });
}
