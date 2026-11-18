/*
 * Site analytics, loaded after the page has rendered so it never blocks first paint.
 * Kept in an external file so the Content-Security-Policy can forbid inline scripts.
 *
 * - Google Analytics 4 and PostHog page views only.
 * - PostHog session recording is OFF (disable_session_recording) and autocapture is off.
 * - Nothing loads if the visitor sends Do Not Track or Global Privacy Control.
 * The privacy page (/privacy) describes exactly this; change both together.
 */
(function () {
  var dnt = navigator.doNotTrack === "1" || window.doNotTrack === "1" || navigator.globalPrivacyControl === true;
  if (dnt) return;

  function loadAnalytics() {
    // Google Analytics 4
    var ga = document.createElement("script");
    ga.async = true;
    ga.src = "https://www.googletagmanager.com/gtag/js?id=G-CYFDCG1GR3";
    document.head.appendChild(ga);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", "G-CYFDCG1GR3");

    // PostHog official loader stub (unchanged from PostHog's snippet), then init.
    !(function (t, e) {
        var o, n, p, r;
        e.__SV ||
            ((window.posthog = e),
            (e._i = []),
            (e.init = function (i, s, a) {
                function g(t, e) {
                    var o = e.split(".");
                    2 == o.length && ((t = t[o[0]]), (e = o[1])),
                        (t[e] = function () {
                            t.push(
                                [e].concat(
                                    Array.prototype.slice.call(
                                        arguments,
                                        0,
                                    ),
                                ),
                            );
                        });
                }
                ((p = t.createElement("script")).type =
                    "text/javascript"),
                    (p.crossOrigin = "anonymous"),
                    (p.async = !0),
                    (p.src =
                        s.api_host.replace(
                            ".i.posthog.com",
                            "-assets.i.posthog.com",
                        ) + "/static/array.js"),
                    (r =
                        t.getElementsByTagName(
                            "script",
                        )[0]).parentNode.insertBefore(p, r);
                var u = e;
                for (
                    void 0 !== a ? (u = e[a] = []) : (a = "posthog"),
                        u.people = u.people || [],
                        u.toString = function (t) {
                            var e = "posthog";
                            return (
                                "posthog" !== a && (e += "." + a),
                                t || (e += " (stub)"),
                                e
                            );
                        },
                        u.people.toString = function () {
                            return u.toString(1) + ".people (stub)";
                        },
                        o =
                            "init me ws ys ps bs capture je Di ks register register_once register_for_session unregister unregister_for_session Ps getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSurveysLoaded onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey canRenderSurveyAsync identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Es $s createPersonProfile Is opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing Ss debug xs getPageViewId captureTraceFeedback captureTraceMetric".split(
                                " ",
                            ),
                        n = 0;
                    n < o.length;
                    n++
                )
                    g(u, o[n]);
                e._i.push([i, s, a]);
            }),
            (e.__SV = 1));
    })(document, window.posthog || []);
    window.posthog.init("phc_yJW1VjHGGwmCbbrtczfqqNxgBDbhlhOWcdzcIJEOTFE", {
      api_host: "https://us.i.posthog.com",
      person_profiles: "identified_only",
      disable_session_recording: true,
      autocapture: false,
      capture_pageview: true,
    });
  }

  if (document.readyState === "complete") {
    setTimeout(loadAnalytics, 1500);
  } else {
    window.addEventListener("load", function () { setTimeout(loadAnalytics, 1500); });
  }
})();
