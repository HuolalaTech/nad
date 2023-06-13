package cn.lalaframework.nad;

import cn.lalaframework.nad.exceptions.NadContextRecursionException;
import cn.lalaframework.nad.exceptions.NoNadContextException;
import cn.lalaframework.nad.models.NadContext;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class NadContextTest {
    @Test
    void outOfContext() {
        Assertions.assertThrows(NoNadContextException.class, NadContext::dump);
    }

    @Test
    void run() {
        // Context must be cleared after run.
        String res = NadContext.run(() -> "ok", null);
        Assertions.assertEquals("ok", res);
        outOfContext();

        // Context must be cleared after run.
        NadContext.run(() -> {
            // Context must be accessible (not null).
            Assertions.assertNotNull(NadContext.dump());
            return null;
        }, null);
        outOfContext();

        // Context must be cleared after throw.
        Assertions.assertThrows(RuntimeException.class, () -> {
            // run
            NadContext.run(() -> {
                throw new RuntimeException("error");
            }, null);
        });
        outOfContext();

        // NadContextRecursionException
        Assertions.assertThrows(NadContextRecursionException.class, () -> {
            // run
            NadContext.run(() -> {
                NadContext.run(() -> null, null);
                return null;
            }, null);
        });
        outOfContext();
    }

}