package cn.lalaframework.nad;

import cn.lalaframework.nad.exceptions.NoHandlerMappingException;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

class NadCoreTest {
    @Test
    void NoHandlerMappingException() {
        // The NadCore.handlerMapping will not be wired by @Autowired annotation here.
        NadCore core = new NadCore();
        Assertions.assertThrows(NoHandlerMappingException.class, core::create);
    }
}