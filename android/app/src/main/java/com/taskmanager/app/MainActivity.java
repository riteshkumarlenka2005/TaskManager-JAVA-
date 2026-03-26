package com.taskmanager.app;

import android.annotation.SuppressLint;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.os.Build;
import android.os.Bundle;
import android.view.View;
import android.view.WindowInsets;
import android.view.WindowInsetsController;
import android.view.WindowManager;
import android.webkit.CookieManager;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.FrameLayout;

import androidx.appcompat.app.AppCompatActivity;
import androidx.swiperefreshlayout.widget.SwipeRefreshLayout;

public class MainActivity extends AppCompatActivity {

    // ============================================================
    // ⚡ SET YOUR DEPLOYED WEBSITE URL HERE ⚡
    // Replace with your actual Vercel deployment URL
    // ============================================================
    private static final String WEBAPP_URL = "https://task-manager-java.vercel.app/mobile/home";

    private WebView webView;
    private FrameLayout splashScreen;
    private SwipeRefreshLayout swipeRefresh;
    private boolean isPageLoaded = false;

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Fullscreen immersive mode
        enableImmersiveMode();

        setContentView(R.layout.activity_main);

        splashScreen = findViewById(R.id.splash_screen);
        webView = findViewById(R.id.webview);
        swipeRefresh = findViewById(R.id.swipe_refresh);

        // Check connectivity first
        if (!isNetworkAvailable()) {
            goOffline();
            return;
        }

        setupWebView();
        setupSwipeRefresh();

        // Load the web app
        webView.loadUrl(WEBAPP_URL);
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        WebSettings settings = webView.getSettings();

        // Core settings
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);

        // Media & content
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setLoadsImagesAutomatically(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        // Performance
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);
        settings.setRenderPriority(WebSettings.RenderPriority.HIGH);

        // Viewport
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        // User agent (identify as app, not browser)
        String defaultUA = settings.getUserAgentString();
        settings.setUserAgentString(defaultUA + " TaskManagerApp/1.0");

        // Enable cookies
        CookieManager cookieManager = CookieManager.getInstance();
        cookieManager.setAcceptCookie(true);
        cookieManager.setAcceptThirdPartyCookies(webView, true);

        // WebViewClient — handles page events
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                if (swipeRefresh != null) {
                    swipeRefresh.setRefreshing(true);
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);

                // Hide splash on first load
                if (!isPageLoaded) {
                    isPageLoaded = true;
                    hideSplash();
                }

                if (swipeRefresh != null) {
                    swipeRefresh.setRefreshing(false);
                }
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                // Only handle main frame errors
                if (request.isForMainFrame()) {
                    goOffline();
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                String url = request.getUrl().toString();
                // Keep all navigation inside WebView
                if (url.startsWith("http://") || url.startsWith("https://")) {
                    view.loadUrl(url);
                    return true;
                }
                return false;
            }
        });

        // WebChromeClient — handle JS dialogs, progress, etc.
        webView.setWebChromeClient(new WebChromeClient());

        // Scrolling
        webView.setOverScrollMode(View.OVER_SCROLL_NEVER);
        webView.setScrollBarStyle(View.SCROLLBARS_INSIDE_OVERLAY);
    }

    private void setupSwipeRefresh() {
        swipeRefresh.setColorSchemeColors(0xFF46F0D2); // Teal accent
        swipeRefresh.setProgressBackgroundColorSchemeColor(0xFF131321); // Dark navy
        swipeRefresh.setOnRefreshListener(() -> {
            if (webView != null) {
                webView.reload();
            }
        });
    }

    private void hideSplash() {
        if (splashScreen != null) {
            splashScreen.animate()
                    .alpha(0f)
                    .setDuration(400)
                    .withEndAction(() -> {
                        splashScreen.setVisibility(View.GONE);
                    })
                    .start();
        }
    }

    private void enableImmersiveMode() {
        // Make fullscreen
        getWindow().setFlags(
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS,
                WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS
        );

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            getWindow().setDecorFitsSystemWindows(false);
            WindowInsetsController controller = getWindow().getInsetsController();
            if (controller != null) {
                controller.hide(WindowInsets.Type.statusBars() | WindowInsets.Type.navigationBars());
                controller.setSystemBarsBehavior(
                        WindowInsetsController.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE
                );
            }
        } else {
            getWindow().getDecorView().setSystemUiVisibility(
                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                            | View.SYSTEM_UI_FLAG_FULLSCREEN
                            | View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_STABLE
                            | View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION
                            | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            );
        }
    }

    // ---- Back button: navigate WebView history or exit ----

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    // ---- Lifecycle ----

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) webView.onResume();
        enableImmersiveMode();
    }

    @Override
    protected void onPause() {
        super.onPause();
        if (webView != null) webView.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }

    // ---- Network check ----

    private boolean isNetworkAvailable() {
        ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
        if (cm != null) {
            NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
            return activeNetwork != null && activeNetwork.isConnectedOrConnecting();
        }
        return false;
    }

    private void goOffline() {
        Intent intent = new Intent(this, OfflineActivity.class);
        startActivity(intent);
        finish();
    }
}
