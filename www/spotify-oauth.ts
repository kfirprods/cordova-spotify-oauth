import "whatwg-fetch";
import exec from "./lib/exec-promise";

/**
 * The authorization data.
 */
export interface AuthorizationData {
  // code that needs to be exchanged for access and refresh tokens
  code: string;
}

/**
 * OAuth configuration data.
 */
export interface Config {
  /** The client ID as per the Spotify dev console. */
  clientId: string;

  /** The redirect URI as entered in the Spotify dev console. */
  redirectUrl: string;

  /**
   * Safety margin time (in milliseconds) for the token refresh.
   *
   * The plugin applies a safety margin to the token lifetime in order
   * to give the token user enough time to perform all operations needed.
   *
   * Otherwise the plugin might hand out a token that is already expired
   * before it could ever be used.
   *
   * The safety margin defaults to 30s.
   */
  refreshSafetyMargin?: number;

  /** Requested OAuth scopes. */
  scopes: string[];
}

/**
 * Obtains valid authorization data.
 *
 * This method performs the necessary steps in order to obtain a valid
 * access token. It performs the OAuth dance prompting the user to log in,
 * exchanges the obtained authorization code for an access and a refresh
 * token, caches those, and returns both to the developer.
 *
 * When it is invoked again, it will first check whether the cached access
 * token is still valid (including a configurable safety margin) and the
 * scopes equal, and return the token directly if that is the case. Otherwise,
 * the method will transparently refresh the token (or obtain a new one if
 * the scopes changed) and return that.
 *
 * Bottom line - always call this if you need a valid access token in your code.
 *
 * @param cfg OAuth configuration
 */
export function authorize(cfg: Config): Promise<AuthorizationData> {
  if (!cfg.clientId) {
    throw new Error("missing clientId");
  }
  if (!cfg.redirectUrl) {
    throw new Error("missing redirectUri");
  }
  if (!Array.isArray(cfg.scopes)) {
    throw new Error("missing scopes");
  }
  if ((cfg.refreshSafetyMargin || 0) < 0) {
    throw new Error("safety margin < 0");
  }

  return oauth(cfg);
}

/**
 * Performs the OAuth dance.
 *
 * @param cfg OAuth2 config
 * @hidden
 */
function oauth(cfg: Config): Promise<AuthorizationData> {
  return exec("getCode", [cfg.clientId, cfg.redirectUrl, cfg.scopes]).then(
    ({ code }: any) => ({ code })
  );
}
